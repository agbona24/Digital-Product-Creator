/**
 * Custom Prisma v7 driver adapter for mysql2.
 * Used because @prisma/adapter-mariadb does not support caching_sha2_password (MySQL 8.0+).
 */
import mysql from "mysql2/promise";
import type {
  SqlDriverAdapter,
  SqlDriverAdapterFactory,
  SqlQuery,
  SqlResultSet,
  ColumnType,
  ConnectionInfo,
  IsolationLevel,
  Transaction,
  TransactionOptions,
} from "@prisma/driver-adapter-utils";
import { ColumnTypeEnum } from "@prisma/driver-adapter-utils";

const PROVIDER = "mysql" as const;
const ADAPTER_NAME = "@local/adapter-mysql2" as const;

// Map MySQL wire protocol field type numbers → Prisma ColumnType
function toColumnType(type: number, flags: number): ColumnType {
  const isBinary = (flags & 128) !== 0;
  switch (type) {
    case 1:   return ColumnTypeEnum.Int32;       // TINYINT
    case 2:   return ColumnTypeEnum.Int32;       // SMALLINT
    case 3:   return ColumnTypeEnum.Int32;       // INT
    case 4:   return ColumnTypeEnum.Float;       // FLOAT
    case 5:   return ColumnTypeEnum.Double;      // DOUBLE
    case 7:   return ColumnTypeEnum.DateTime;    // TIMESTAMP
    case 8:   return ColumnTypeEnum.Int64;       // BIGINT
    case 9:   return ColumnTypeEnum.Int32;       // MEDIUMINT
    case 10:  return ColumnTypeEnum.Date;        // DATE
    case 11:  return ColumnTypeEnum.Time;        // TIME
    case 12:  return ColumnTypeEnum.DateTime;    // DATETIME
    case 13:  return ColumnTypeEnum.Int32;       // YEAR
    case 0:
    case 246: return ColumnTypeEnum.Numeric;     // DECIMAL / NEWDECIMAL
    case 16:  return ColumnTypeEnum.Bytes;       // BIT
    case 245: return ColumnTypeEnum.Json;        // JSON
    case 247: return ColumnTypeEnum.Enum;        // ENUM
    case 248: return ColumnTypeEnum.Text;        // SET
    case 249:
    case 250:
    case 251:
    case 252: return isBinary ? ColumnTypeEnum.Bytes : ColumnTypeEnum.Text; // BLOB/TEXT
    case 15:
    case 253:
    case 254: return isBinary ? ColumnTypeEnum.Bytes : ColumnTypeEnum.Text; // VARCHAR/CHAR
    default:  return ColumnTypeEnum.Text;
  }
}

function convertResultValue(val: unknown): unknown {
  if (val === null || val === undefined) return null;
  if (Buffer.isBuffer(val)) return new Uint8Array(val);
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "bigint") return val.toString();
  return val;
}

function mapArg(arg: unknown, type: string): unknown {
  if (arg === null || arg === undefined) return null;
  if (type === "bytes" && arg instanceof Uint8Array) return Buffer.from(arg);
  if (type === "datetime" && typeof arg === "string") return new Date(arg);
  if (type === "bigint" && typeof arg === "string") return BigInt(arg);
  return arg;
}

async function runQuery(
  conn: mysql.Pool | mysql.PoolConnection,
  query: SqlQuery
): Promise<SqlResultSet> {
  const args = query.args.map((a, i) => mapArg(a, query.argTypes[i].scalarType)) as mysql.ExecuteValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await (conn as any).execute(query.sql, args);

  // mysql2 returns a [rows, fields] tuple.
  // rows = RowDataPacket[] for SELECT, ResultSetHeader for DML.
  // Prisma may call queryRaw for DML too (to capture lastInsertId).
  const rows: unknown = Array.isArray(raw) ? raw[0] : raw;
  const fields: unknown = Array.isArray(raw) ? raw[1] : undefined;

  if (!Array.isArray(rows)) {
    const header = rows as mysql.ResultSetHeader;
    return {
      columnNames: [],
      columnTypes: [],
      rows: [],
      lastInsertId: header?.insertId != null ? String(header.insertId) : undefined,
    };
  }

  const f: mysql.FieldPacket[] = Array.isArray(fields) ? fields : [];
  const columnNames = f.map((c) => c.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columnTypes = f.map((c) => toColumnType((c as any).type ?? 0, (c as any).flags ?? 0));
  const mappedRows = rows.map((row: mysql.RowDataPacket) =>
    columnNames.map((col) => convertResultValue(row[col]))
  );
  return { columnNames, columnTypes, rows: mappedRows };
}

async function runExecute(
  conn: mysql.Pool | mysql.PoolConnection,
  query: SqlQuery
): Promise<number> {
  const args = query.args.map((a, i) => mapArg(a, query.argTypes[i].scalarType)) as mysql.ExecuteValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result] = await (conn as any).execute(query.sql, args) as [mysql.ResultSetHeader, mysql.FieldPacket[]];
  return result.affectedRows ?? 0;
}

class Mysql2Transaction implements Transaction {
  readonly provider = PROVIDER;
  readonly adapterName = ADAPTER_NAME;
  readonly options: TransactionOptions = { usePhantomQuery: false };

  constructor(private readonly conn: mysql.PoolConnection) {}

  async queryRaw(query: SqlQuery): Promise<SqlResultSet> {
    return runQuery(this.conn, query);
  }

  async executeRaw(query: SqlQuery): Promise<number> {
    return runExecute(this.conn, query);
  }

  async commit(): Promise<void> {
    await this.conn.commit();
    this.conn.release();
  }

  async rollback(): Promise<void> {
    await this.conn.rollback();
    this.conn.release();
  }

  async createSavepoint(name: string): Promise<void> {
    await this.conn.execute(`SAVEPOINT ${name}`);
  }

  async rollbackToSavepoint(name: string): Promise<void> {
    await this.conn.execute(`ROLLBACK TO SAVEPOINT ${name}`);
  }

  async releaseSavepoint(name: string): Promise<void> {
    await this.conn.execute(`RELEASE SAVEPOINT ${name}`);
  }
}

class Mysql2Adapter implements SqlDriverAdapter {
  readonly provider = PROVIDER;
  readonly adapterName = ADAPTER_NAME;

  constructor(private readonly pool: mysql.Pool) {}

  getConnectionInfo(): ConnectionInfo {
    return { supportsRelationJoins: false };
  }

  async queryRaw(query: SqlQuery): Promise<SqlResultSet> {
    return runQuery(this.pool, query);
  }

  async executeRaw(query: SqlQuery): Promise<number> {
    return runExecute(this.pool, query);
  }

  async executeScript(script: string): Promise<void> {
    for (const stmt of script.split(";").map((s) => s.trim()).filter(Boolean)) {
      await this.pool.execute(stmt);
    }
  }

  async startTransaction(isolationLevel?: IsolationLevel): Promise<Transaction> {
    const conn = await this.pool.getConnection();
    if (isolationLevel) {
      await conn.execute(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
    }
    await conn.beginTransaction();
    return new Mysql2Transaction(conn);
  }

  async dispose(): Promise<void> {
    await this.pool.end();
  }
}

export class PrismaMySQL2 implements SqlDriverAdapterFactory {
  readonly provider = PROVIDER;
  readonly adapterName = ADAPTER_NAME;

  private readonly poolOptions: mysql.PoolOptions;

  constructor(urlOrOptions: string | mysql.PoolOptions) {
    const base: mysql.PoolOptions =
      typeof urlOrOptions === "string"
        ? { uri: urlOrOptions }
        : urlOrOptions;

    this.poolOptions = {
      ...base,
      // cPanel MySQL servers use self-signed certs — allow SSL without CA verification
      ssl: { rejectUnauthorized: false },
      // Serverless-friendly pool: small, fast timeouts
      connectionLimit: 5,
      connectTimeout: 10000,
      waitForConnections: true,
      queueLimit: 0,
    };
  }

  async connect(): Promise<SqlDriverAdapter> {
    const pool = mysql.createPool(this.poolOptions);
    return new Mysql2Adapter(pool);
  }
}

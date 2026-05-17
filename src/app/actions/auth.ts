"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function register(formData: FormData): Promise<void> {
  const firstName = (formData.get("first-name") as string)?.trim();
  const lastName = (formData.get("last-name") as string)?.trim();
  const name = `${firstName} ${lastName}`.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password || password.length < 8) {
    redirect("/signup?error=Please+fill+in+all+fields.+Password+must+be+at+least+8+characters.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=An+account+with+this+email+already+exists.");
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, password: hashed } });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

export async function login(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=Invalid+email+or+password.");
    }
    throw error;
  }
}

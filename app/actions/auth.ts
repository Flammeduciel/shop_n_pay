"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { safeCallbackPath } from "@/lib/callback";
import { createUser } from "@/lib/users";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallbackPath(String(formData.get("callbackUrl") ?? ""));

  if (!email || !password) {
    redirect(`/connexion?erreur=champs&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        `/connexion?erreur=identifiants&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    }

    throw error;
  }

  redirect(callbackUrl);
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    redirect("/inscription?erreur=champs");
  }

  if (password.length < 8) {
    redirect("/inscription?erreur=motdepasse");
  }

  try {
    await createUser(name, email, password);
  } catch {
    redirect("/inscription?erreur=existant");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/compte",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/connexion");
    }
    throw error;
  }

  redirect("/compte");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

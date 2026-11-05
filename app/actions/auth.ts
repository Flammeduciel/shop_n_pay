"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { safeCallbackPath } from "@/lib/callback";

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

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

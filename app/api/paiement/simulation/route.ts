import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDemoMode } from "@/lib/monetbil";
import {
  clearPendingOrder,
  getPendingOrder,
  saveOrder,
} from "@/lib/orders";
import type { OrderStatus } from "@/lib/status";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(
      new URL("/connexion?callbackUrl=/paiement", request.url),
      303,
    );
  }

  if (!isDemoMode()) {
    return NextResponse.redirect(new URL("/paiement", request.url), 303);
  }

  const form = await request.formData();
  const reference = String(form.get("ref") ?? "");
  const decision = String(form.get("decision") ?? "");
  const pending = await getPendingOrder();

  if (!pending || pending.ref !== reference) {
    return NextResponse.redirect(new URL("/panier", request.url), 303);
  }

  const status: OrderStatus = decision === "echec" ? "echec" : "paye";
  await saveOrder({ ...pending, status });
  await clearPendingOrder();

  const confirmationUrl = new URL("/paiement/confirmation", request.url);
  confirmationUrl.searchParams.set("ref", pending.ref);
  confirmationUrl.searchParams.set("statut", status);

  return NextResponse.redirect(confirmationUrl, 303);
}

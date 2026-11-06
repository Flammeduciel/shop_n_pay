import { NextResponse } from "next/server";
import {
  checkMonetbilPayment,
  getMonetbilConfig,
  paymentStatusFromCode,
} from "@/lib/monetbil";
import {
  clearPendingOrder,
  getPendingOrder,
  saveOrder,
} from "@/lib/orders";
import type { OrderStatus } from "@/lib/status";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pending = await getPendingOrder();

  if (!pending) {
    return NextResponse.redirect(new URL("/panier", request.url), 303);
  }

  const reference =
    url.searchParams.get("payment_ref") ?? url.searchParams.get("item_ref") ?? "";
  if (reference && reference !== pending.ref) {
    return NextResponse.redirect(new URL("/panier", request.url), 303);
  }

  const transactionId =
    url.searchParams.get("transaction_id") ??
    url.searchParams.get("paymentId") ??
    url.searchParams.get("transaction_uuid") ??
    "";

  const config = getMonetbilConfig();
  let status: OrderStatus = "attente";

  if (!config.demo && transactionId) {
    const check = await checkMonetbilPayment(transactionId);
    status = paymentStatusFromCode(check.status);
  }

  if (status !== "attente") {
    await saveOrder({ ...pending, status });
    await clearPendingOrder();
  }

  const confirmationUrl = new URL("/paiement/confirmation", request.url);
  confirmationUrl.searchParams.set("ref", pending.ref);
  confirmationUrl.searchParams.set("statut", status);

  return NextResponse.redirect(confirmationUrl, 303);
}

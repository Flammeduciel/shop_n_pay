import { NextResponse } from "next/server";
import {
  checkMonetbilPayment,
  paymentStatusFromCode,
  verifyMonetbilSignature,
} from "@/lib/monetbil";

export const runtime = "nodejs";

async function readParams(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return {};

    return Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, String(value ?? "")]),
    );
  }

  const form = await request.formData();
  const params: Record<string, string> = {};
  form.forEach((value, key) => {
    if (typeof value === "string") params[key] = value;
  });

  return params;
}

export async function POST(request: Request) {
  const params = await readParams(request);

  if (!verifyMonetbilSignature(params)) {
    return new NextResponse("Signature invalide", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const transactionId =
    params.transaction_id ?? params.paymentId ?? params.transaction_uuid ?? "";
  const reference = params.payment_ref ?? params.item_ref ?? "inconnue";

  if (transactionId) {
    const check = await checkMonetbilPayment(transactionId);
    const status = paymentStatusFromCode(check.status);
    console.info(`[monetbil] paiement ${reference} : ${status}`);
  } else {
    console.info(`[monetbil] notification sans identifiant pour ${reference}`);
  }

  return new NextResponse("received", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

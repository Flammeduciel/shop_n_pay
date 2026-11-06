import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resolveCart } from "@/lib/cart";
import { createMonetbilPayment } from "@/lib/monetbil";
import { setPendingOrder, type PendingOrder } from "@/lib/orders";
import { cleanText, isCartPayload, normalizePhone } from "@/lib/validation";

export const runtime = "nodejs";

type RequestBody = {
  items?: unknown;
  customer?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Votre session a expiré. Reconnectez-vous pour continuer." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body || !isCartPayload(body.items)) {
    return NextResponse.json(
      { error: "Le contenu du panier est invalide." },
      { status: 400 },
    );
  }

  const totals = resolveCart(body.items);
  if (totals.lines.length === 0) {
    return NextResponse.json(
      { error: "Aucun produit valide dans le panier." },
      { status: 400 },
    );
  }

  const rawCustomer = body.customer ?? {};
  const firstName = cleanText(rawCustomer.firstName, 60);
  const lastName = cleanText(rawCustomer.lastName, 60);
  const phone = normalizePhone(rawCustomer.phone);
  const city = cleanText(rawCustomer.city, 60);
  const address = cleanText(rawCustomer.address, 160);
  const note = cleanText(rawCustomer.note, 500);

  if (!firstName || !lastName || !city || !address) {
    return NextResponse.json(
      { error: "Complétez le prénom, le nom, la ville et l'adresse de livraison." },
      { status: 400 },
    );
  }

  if (!phone) {
    return NextResponse.json(
      { error: "Le numéro de téléphone Mobile Money est invalide." },
      { status: 400 },
    );
  }

  const reference = `SP-${Date.now().toString(36).toUpperCase()}-${randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;

  const pending: PendingOrder = {
    ref: reference,
    createdAt: new Date().toISOString(),
    items: totals.lines.map((line) => ({
      slug: line.product.slug,
      name: line.product.name,
      quantity: line.quantity,
      unitPrice: line.product.price,
    })),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    customer: {
      firstName,
      lastName,
      phone,
      city,
      address,
      note,
    },
  };

  await setPendingOrder(pending);

  try {
    const payment = await createMonetbilPayment({
      amount: totals.total,
      phone,
      itemRef: reference,
      paymentRef: reference,
      userId: session.user.id,
      firstName,
      lastName,
      email: session.user.email ?? "",
    });

    return NextResponse.json({
      paymentUrl: payment.paymentUrl,
      reference,
      demo: payment.demo,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Le paiement n'a pas pu être initialisé.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}

import { createHash } from "node:crypto";
import { siteConfig } from "./site";
import type { OrderStatus } from "./status";

const WIDGET_BASE_URL = "https://www.monetbil.com/widget/v2.1";
const CHECK_PAYMENT_URL = "https://api.monetbil.com/payment/v1/checkPayment";

export type MonetbilPaymentInput = {
  amount: number;
  phone: string;
  itemRef: string;
  paymentRef: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

type MonetbilConfig = {
  serviceKey: string;
  serviceSecret: string;
  demo: boolean;
  logoUrl: string;
};

export function getMonetbilConfig(): MonetbilConfig {
  const serviceKey = (process.env.MONETBIL_SERVICE_KEY ?? "").trim();
  const serviceSecret = (process.env.MONETBIL_SERVICE_SECRET ?? "").trim();
  const demo = false;

  return {
    serviceKey,
    serviceSecret,
    demo,
    logoUrl: (process.env.MONETBIL_LOGO_URL ?? "").trim(),
  };
}

export function isDemoMode(): boolean {
  return getMonetbilConfig().demo;
}

export function signMonetbilParams(
  serviceSecret: string,
  params: Record<string, string>,
): string {
  const orderedValues = Object.keys(params)
    .sort()
    .map((key) => params[key] ?? "")
    .join("");

  return createHash("md5").update(`${serviceSecret}${orderedValues}`, "utf8").digest("hex");
}

function paymentParams(input: MonetbilPaymentInput, logoUrl: string): Record<string, string> {
  return {
    amount: String(input.amount),
    phone: input.phone,
    country: "CM",
    currency: "XAF",
    item_ref: input.itemRef,
    payment_ref: input.paymentRef,
    locale: "fr",
    user: input.userId,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    return_url: `${siteConfig.url}/api/paiement/retour`,
    notify_url: `${siteConfig.url}/api/paiement/notification`,
    logo: logoUrl || `${siteConfig.url}/icon.svg`,
  };
}

export async function createMonetbilPayment(
  input: MonetbilPaymentInput,
): Promise<{ paymentUrl: string; demo: boolean }> {
  const config = getMonetbilConfig();

  if (!config.serviceKey || !config.serviceSecret) {
    throw new Error("Les clés Monetbil ne sont pas configurées.");
  }

  const params = paymentParams(input, config.logoUrl);
  const sign = signMonetbilParams(config.serviceSecret, params);
  const body = new URLSearchParams({
    ...params,
    sign,
  });

  let response: Response;

  try {
    response = await fetch(
      `${WIDGET_BASE_URL}/${encodeURIComponent(config.serviceKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      },
    );
  } catch {
    throw new Error("Le service de paiement est injoignable pour le moment.");
  }

  const payload = (await response.json().catch(() => null)) as
    | { payment_url?: string }
    | null;

  if (!response.ok || !payload?.payment_url) {
    throw new Error("Le service de paiement n'a pas renvoyé d'adresse valide.");
  }

  return { paymentUrl: payload.payment_url, demo: false };
}

export type MonetbilCheckResult = {
  status: number | null;
  testmode: boolean;
};

export async function checkMonetbilPayment(
  paymentId: string,
): Promise<MonetbilCheckResult> {
  const body = new URLSearchParams({ paymentId });

  try {
    const response = await fetch(CHECK_PAYMENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | { transaction?: { status?: number | string; testmode?: number | string } }
      | null;

    const status = payload?.transaction?.status;
    const testmode = payload?.transaction?.testmode;

    return {
      status: status === undefined || status === null ? null : Number(status),
      testmode: Number(testmode) === 1,
    };
  } catch {
    return { status: null, testmode: false };
  }
}

export function verifyMonetbilSignature(params: Record<string, string>): boolean {
  const { sign, ...rest } = params;
  if (!sign) return false;

  const config = getMonetbilConfig();
  if (!config.serviceSecret) return false;

  const expected = signMonetbilParams(config.serviceSecret, rest);

  return expected.toLowerCase() === sign.toLowerCase();
}

export function paymentStatusFromCode(status: number | null): OrderStatus {
  if (status === 1 || status === 7) return "paye";
  if (status === -1 || status === 9) return "annule";
  if (status === 0 || status === 8) return "echec";

  return "attente";
}

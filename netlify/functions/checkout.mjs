// POST /api/checkout  { slug }  →  { url }
//
// Creates a Stripe Checkout Session for a single guide and returns the hosted
// checkout URL. The client only sends a product slug — price, name and
// description are looked up server-side from the shared catalog so they cannot
// be tampered with. Stripe is called via its REST API directly.
//
// Every payment gets a sequential order number ("Raxaca Home Order #10023"),
// stored as the PaymentIntent description so it shows in the Stripe dashboard
// and on receipts. The counter lives in Netlify Blobs; if Blobs is unavailable
// (e.g. running the function outside Netlify) a time-based number is used.

import { getStore } from "@netlify/blobs";
import { products } from "../../public/data/products.js";

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";
const BRAND = "Raxaca Home";
const FIRST_ORDER_NUMBER = 10001;

export default async (request) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json(
      { error: "Checkout is not configured yet. Add STRIPE_SECRET_KEY to the site's environment variables." },
      503
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const product = products.find((p) => p.slug === body?.slug);
  if (!product) {
    return json({ error: "Unknown product." }, 404);
  }

  const orderNumber = await nextOrderNumber();
  const origin = siteOrigin(request);

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`);
  params.set("cancel_url", `${origin}/ebooks/${product.slug}?canceled=1`);
  params.set("allow_promotion_codes", "true");
  params.set("client_reference_id", `order-${orderNumber}`);
  params.set("payment_intent_data[description]", `${BRAND} Order #${orderNumber}`);
  params.set("metadata[order_number]", String(orderNumber));
  params.set("metadata[product_slug]", product.slug);
  params.set("line_items[0][quantity]", "1");

  if (product.stripePriceId) {
    params.set("line_items[0][price]", product.stripePriceId);
  } else {
    params.set("line_items[0][price_data][currency]", "usd");
    params.set("line_items[0][price_data][unit_amount]", String(product.priceCents));
    params.set("line_items[0][price_data][product_data][name]", product.title);
    params.set("line_items[0][price_data][product_data][description]", product.tagline);
  }

  let stripeResponse;
  try {
    stripeResponse = await fetch(STRIPE_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
  } catch (err) {
    console.error("Stripe request failed", err);
    return json({ error: "Could not reach Stripe. Please try again." }, 502);
  }

  const session = await stripeResponse.json();
  if (!stripeResponse.ok || !session.url) {
    console.error("Stripe error", session.error);
    return json({ error: session.error?.message || "Stripe rejected the request." }, 502);
  }

  return json({ url: session.url });
};

export const config = { path: "/api/checkout" };

async function nextOrderNumber() {
  try {
    const store = getStore("orders");
    const current = Number(await store.get("counter")) || FIRST_ORDER_NUMBER - 1;
    const next = current + 1;
    await store.set("counter", String(next));
    return next;
  } catch (err) {
    // No Blobs outside the Netlify runtime: fall back to seconds since launch
    // so numbers still increase and are unique enough for support lookups.
    console.warn("Order counter unavailable, using time-based order number:", err?.message || err);
    return FIRST_ORDER_NUMBER + Math.floor((Date.now() - Date.UTC(2026, 9, 15)) / 1000);
  }
}

function siteOrigin(request) {
  try {
    return new URL(request.url).origin;
  } catch {
    return process.env.URL || "http://localhost:8888";
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

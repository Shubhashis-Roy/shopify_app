import { json } from "@remix-run/node";
import shopify from "../shopify.server";

const FASTAPI_URL = "https://fastapi-bot-r2g1.onrender.com/graphql";

export async function action({ request }) {
  const body = await request.json();
  const { message, shop } = body;

  if (!shop) {
    return json({ error: "Missing shop" }, { status: 400 });
  }

  // ✅ Use offline session (NO ADMIN AUTH)
  const { admin } = await shopify.unauthenticated.admin(shop);

  // 🔹 Fetch products
  const response = await admin.graphql(`
    {
      products(first: 10) {
        nodes {
          id
          title
          description
          variants(first: 1) {
            nodes {
              price
            }
          }
        }
      }
    }
  `);

  const data = await response.json();
  const products = data.data.products.nodes;

  // 🔹 Send to FastAPI
  const fastapiRes = await fetch(FASTAPI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation SendMessage($text: String!, $products: String!) {
          sendMessage(text: $text, products: $products) {
            bot
          }
        }
      `,
      variables: {
        text: message,
        products: JSON.stringify(products),
      },
    }),
  });

  const result = await fastapiRes.json();

  return json({
    reply: result.data.sendMessage.bot,
  });
}

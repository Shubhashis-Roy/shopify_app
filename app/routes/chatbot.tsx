import ChatBotCore from "app/components/ChatBotCore";
import { useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  const headers = new Headers();

  // Dynamic + safe CSP (this is the most reliable pattern)
  if (shop?.includes(".myshopify.com")) {
    headers.set(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com https://shopify-app-95ky.onrender.com;`,
    );
  } else {
    // Very broad fallback (helps during testing)
    headers.set(
      "Content-Security-Policy",
      `frame-ancestors https://*.myshopify.com https://admin.shopify.com https://shopify-app-95ky.onrender.com https://*.onrender.com;`,
    );
  }

  // Important: Also allow the iframe to be embedded by itself
  headers.set("X-Frame-Options", "ALLOW-FROM https://admin.shopify.com");

  return new Response(null, { headers });
};

export default function Chatbot() {
  const [params] = useSearchParams();
  const shop = params.get("shop");

  return (
    <div style={{ padding: "10px", height: "100vh", background: "#fff" }}>
      <h3
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "18px",
          margin: "12px 0",
        }}
      >
        AI Shoe Assistant
      </h3>
      <div id="chatbot-root">
        <ChatBotCore shop={shop} />
      </div>
    </div>
  );
}

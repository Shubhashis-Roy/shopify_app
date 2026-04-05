import ChatBotCore from "app/components/ChatBotCore";
// import { useSearchParams } from "@remix-run/react";
import { useSearchParams } from "react-router";
// import { useSearchParams } from "@shopify/shopify-app-react-router";

export const loader = () => {
  return null;
};

export const headers = () => {
  return {
    "Content-Security-Policy":
      "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
  };
};

export default function Chatbot() {
  const [params] = useSearchParams();
  const shop = params.get("shop");
  return (
    <div>
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
        {/* <ChatBotCore /> */}
        <ChatBotCore shop={shop} />
      </div>
    </div>
  );
}

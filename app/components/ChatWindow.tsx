import { BlockStack } from "@shopify/polaris";
import ChatMessage from "./ChatMessage";

type Message = {
  role: "user" | "bot";
  text: string;
};

type Props = {
  messages: Message[];
};

export default function ChatWindow({ messages }: Props) {
  return (
    <div
      style={{
        height: "350px",
        overflowY: "auto",
        border: "1px solid #eee",
        padding: "12px",
        borderRadius: "8px",
      }}
    >
      <BlockStack gap="200">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} text={msg.text} />
        ))}
      </BlockStack>
    </div>
  );
}

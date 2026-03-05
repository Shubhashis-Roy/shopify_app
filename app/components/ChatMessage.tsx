import { InlineStack, Text } from "@shopify/polaris";

type Props = {
  role: "user" | "bot";
  text: string;
};

export default function ChatMessage({ role, text }: Props) {
  return (
    <InlineStack align={role === "user" ? "end" : "start"}>
      <div
        style={{
          background: role === "user" ? "#008060" : "#f1f1f1",
          color: role === "user" ? "white" : "black",
          padding: "10px 14px",
          borderRadius: "10px",
          maxWidth: "70%",
        }}
      >
        <Text as="p">{text}</Text>
      </div>
    </InlineStack>
  );
}

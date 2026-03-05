import { useState } from "react";
import { Page, Card, BlockStack } from "@shopify/polaris";

import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { sendChatMessage } from "../services/chatbot";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function AppIndex() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    try {
      setLoading(true);

      const botReply = await sendChatMessage(userMessage);

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error contacting bot server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Shoes Assistant">
      <Card>
        <BlockStack gap="400">
          <ChatWindow messages={messages} />
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            loading={loading}
          />
        </BlockStack>
      </Card>
    </Page>
  );
}

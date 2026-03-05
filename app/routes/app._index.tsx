import { useState } from "react";
import {
  Page,
  Card,
  TextField,
  Button,
  BlockStack,
  Text,
  InlineStack,
} from "@shopify/polaris";
import { SendIcon } from "@shopify/polaris-icons";

export default function AppIndex() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    try {
      setLoading(true);

      const res = await fetch("https://fastapi-bot-r2g1.onrender.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
              mutation SendMessage($text: String!) {
                sendMessage(text: $text) {
                  bot
                }
              }
            `,
          variables: { text: userMessage },
        }),
      });

      const result = await res.json();

      const botReply = result.data.sendMessage.bot;

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
          {/* Chat Messages */}
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
                <InlineStack
                  key={i}
                  align={msg.role === "user" ? "end" : "start"}
                >
                  <div
                    style={{
                      background: msg.role === "user" ? "#008060" : "#f1f1f1",
                      color: msg.role === "user" ? "white" : "black",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      maxWidth: "70%",
                    }}
                  >
                    <Text as="p">{msg.text}</Text>
                  </div>
                </InlineStack>
              ))}
            </BlockStack>
          </div>

          {/* Input */}
          <InlineStack gap="200" align="end">
            <div style={{ flex: 1 }}>
              <TextField
                label=""
                value={input}
                onChange={setInput}
                autoComplete="off"
                placeholder="Ask about shoes..."
                multiline={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>

            <Button
              icon={SendIcon}
              onClick={sendMessage}
              loading={loading}
              variant="primary"
              accessibilityLabel="Send message"
            />
          </InlineStack>
        </BlockStack>
      </Card>
    </Page>
  );
}

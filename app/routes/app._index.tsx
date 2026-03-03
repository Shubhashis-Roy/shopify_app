import { useState } from "react";
import {
  Page,
  Card,
  TextField,
  Button,
  BlockStack,
  Text,
} from "@shopify/polaris";

export default function AppIndex() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error(error);
      setResponse("Error contacting bot server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Shoes Bot">
      <Card>
        <BlockStack gap="400">
          <TextField
            label="Ask something"
            value={input}
            onChange={setInput}
            autoComplete="off"
          />

          <Button loading={loading} onClick={sendMessage}>
            Send
          </Button>

          {response && <Text as="p">{response}</Text>}
        </BlockStack>
      </Card>
    </Page>
  );
}

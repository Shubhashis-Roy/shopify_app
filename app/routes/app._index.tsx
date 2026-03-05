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
          variables: {
            text: input,
          },
        }),
      });

      const result = await res.json();

      setResponse(result.data.sendMessage.bot);
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

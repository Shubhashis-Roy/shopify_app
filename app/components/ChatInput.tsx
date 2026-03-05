import { InlineStack, TextField, Button } from "@shopify/polaris";
import { SendIcon } from "@shopify/polaris-icons";

type Props = {
  input: string;
  setInput: (v: string) => void;
  sendMessage: () => void;
  loading: boolean;
};

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  loading,
}: Props) {
  return (
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
  );
}

import { useState, useEffect } from "react";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { sendChatMessage, getChatHistory } from "../services/chatbot";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatBotCore({ shop }: { shop: string | null }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();

        const formattedMessages = history.reverse().flatMap((msg: any) => [
          { role: "user", text: msg.user },
          { role: "bot", text: msg.bot },
        ]);

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };

    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    try {
      setLoading(true);

      const botReply = await sendChatMessage(userMessage, shop);
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
    <div>
      <ChatWindow messages={messages} />
      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
      />
    </div>
  );
}

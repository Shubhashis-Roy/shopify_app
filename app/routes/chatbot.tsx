import ChatBotCore from "app/components/ChatBotCore";

export default function Chatbot() {
  return (
    <html>
      <body>
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
          <ChatBotCore />
        </div>
      </body>
    </html>
  );
}

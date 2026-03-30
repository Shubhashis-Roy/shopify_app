import ChatBotCore from "app/components/ChatBotCore";

export default function Chatbot() {
  return (
    <html>
      <body>
        <h3>Chatbot Loaded</h3>
        <div id="chatbot-root">
          <ChatBotCore />
        </div>
      </body>
    </html>
  );
}

// const BASE_URL = "https://fastapi-bot-r2g1.onrender.com/graphql";
const BASE_URL = "/api/chat";

export async function getChatHistory() {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          chatHistory {
            user
            bot
          }
        }
      `,
    }),
  });

  const result = await res.json();

  return result.data.chatHistory;
}

export async function sendChatMessage(text: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: text,
    }),
  });

  const result = await res.json();
  return result.reply;
}

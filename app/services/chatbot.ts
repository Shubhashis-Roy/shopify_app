const BASE_URL = "https://fastapi-bot-r2g1.onrender.com/graphql";

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
  const res = await fetch(BASE_URL, {
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
      variables: { text },
    }),
  });

  const result = await res.json();
  return result.data.sendMessage.bot as string;
}

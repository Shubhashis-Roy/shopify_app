export async function sendChatMessage(text: string) {
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
      variables: { text },
    }),
  });

  const result = await res.json();
  return result.data.sendMessage.bot as string;
}

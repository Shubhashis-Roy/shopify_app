import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const js = `
    (function () {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://shopify-app-95ky.onrender.com/chatbot';
      iframe.style.position = 'fixed';
      iframe.style.bottom = '20px';
      iframe.style.right = '20px';
      iframe.style.width = '350px';
      iframe.style.height = '500px';
      iframe.style.border = 'none';
      iframe.style.zIndex = '9999';

      document.body.appendChild(iframe);
    })();
  `;

  return new Response(js, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
};

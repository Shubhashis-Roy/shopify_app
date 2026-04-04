import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const js = `
    (function () {
      // prevent duplicate injection
      if (document.getElementById('chatbot-launcher')) return;

      // --- Create launcher button ---
      const btn = document.createElement('div');
      btn.id = 'chatbot-launcher';
      btn.innerHTML = \`
      <div style="position:relative;width:24px;height:24px;">
        <span style="font-size:18px;">👟</span>
        <span style="position:absolute;bottom:-2px;right:-4px;font-size:12px;">💬</span>
      </div>
      \`;
      Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: '9999'
      });

      document.body.appendChild(btn);

      // --- Create iframe (hidden initially) ---
      const iframe = document.createElement('iframe');
      iframe.src = 'https://shopify-app-95ky.onrender.com/chatbot';
      iframe.id = 'chatbot-iframe';

      Object.assign(iframe.style, {
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '350px',
        height: '500px',
        border: 'none',
        zIndex: '9999',
        display: 'none',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      });

      document.body.appendChild(iframe);

      // --- Toggle logic ---
      btn.onclick = function () {
        iframe.style.display =
          iframe.style.display === 'none' ? 'block' : 'none';
      };
    })();
  `;

  return new Response(js, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
};

import type { LoaderFunctionArgs } from "@remix-run/node";

// ✅ Ensure Remix always treats this as a JS resource route
export const headers = () => ({
  "Content-Type": "application/javascript; charset=utf-8",
  "Cache-Control": "no-store",
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const js = `
      (function () {
        if (document.getElementById('chatbot-launcher')) return;

        function getShop(retries = 20) {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              const shop = window.SHOPIFY_CHATBOT_CONFIG?.shop;

              if (shop && shop !== "undefined") {
                clearInterval(interval);
                resolve(shop);
              }

              if (--retries <= 0) {
                clearInterval(interval);
                resolve(null);
              }
            }, 100);
          });
        }

        (async function () {
          const shop = await getShop();

          console.log("SHOP FROM WIDGET:", shop);

          // --- Button ---
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

          // --- iframe ---
          const iframe = document.createElement('iframe');

          iframe.src =
            'https://shopify-app-95ky.onrender.com/chatbot?shop=' +
            encodeURIComponent(shop || '');

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

          // --- toggle ---
          btn.onclick = function () {
            iframe.style.display =
              iframe.style.display === 'none' ? 'block' : 'none';
          };
        })();
      })();
    `;

    // ✅ Force correct response type
    return new Response(js, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    // ✅ Hard guard (prevents Shopify breaking)
    return new Response("console.error('Chatbot widget failed to load');", {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
      },
    });
  }
};

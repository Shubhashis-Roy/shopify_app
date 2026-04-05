import type { LoaderFunctionArgs } from "@remix-run/node";

export const headers = () => ({
  "Content-Type": "application/javascript; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const js = `
      (function () {
        if (document.getElementById('chatbot-launcher')) {
          console.log('%c[Chatbot Widget v12] Already loaded - skipping', 'color: orange; font-weight: bold');
          return;
        }

        function getShop(retries = 40) {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              const shop = window.SHOPIFY_CHATBOT_CONFIG?.shop;
              if (shop && shop.includes('.myshopify.com')) {
                clearInterval(interval);
                resolve(shop);
              }
              if (--retries <= 0) {
                clearInterval(interval);
                console.warn('[Chatbot Widget] Could not detect shop domain');
                resolve(null);
              }
            }, 80);
          });
        }

        (async function () {
          const shop = await getShop();
          console.log('%c[Chatbot Widget v12] Loaded - Shop:', shop || 'unknown', 'color: green; font-weight: bold');

          // --- Launcher Button ---
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
            zIndex: '9999',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            userSelect: 'none'
          });

          document.body.appendChild(btn);

          // --- Iframe ---
          const iframe = document.createElement('iframe');
          iframe.src = 'https://shopify-app-95ky.onrender.com/chatbot?shop=' + 
                       encodeURIComponent(shop || '');
          iframe.id = 'chatbot-iframe';
          iframe.allow = "clipboard-write";   // Helpful for chat input

          Object.assign(iframe.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '350px',
            height: '500px',
            border: 'none',
            zIndex: '9999',
            display: 'none',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
          });

          document.body.appendChild(iframe);

          // --- Toggle Functionality ---
          btn.onclick = function () {
            iframe.style.display = (iframe.style.display === 'none') ? 'block' : 'none';
          };

          // Optional: Close when clicking outside (nice UX)
          document.addEventListener('click', function(e) {
            if (!btn.contains(e.target) && !iframe.contains(e.target)) {
              iframe.style.display = 'none';
            }
          });
        })();
      })();
    `;

    return new Response(js, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Widget load error:", error);
    return new Response("console.error('[Chatbot Widget] Failed to load');", {
      headers: { "Content-Type": "application/javascript; charset=utf-8" },
    });
  }
};

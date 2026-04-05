import type { LoaderFunctionArgs } from "@remix-run/node";

// Ensure JS response
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

          console.log("[CHATBOT] shop:", shop);

          if (!shop) {
            console.warn("[CHATBOT] shop is NULL - fallback may be required");
          }

          // ---------------------------
          // Button
          // ---------------------------
          const btn = document.createElement('div');
          btn.id = 'chatbot-launcher';
          btn.innerHTML = "💬";

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

          // ---------------------------
          // iframe
          // ---------------------------
          const iframe = document.createElement('iframe');

          const iframeSrc =
            'https://shopify-app-95ky.onrender.com/chatbot?shop=' +
            encodeURIComponent(shop || '');

          console.log("[CHATBOT] iframe src:", iframeSrc);

          iframe.src = iframeSrc;
          iframe.id = 'chatbot-iframe';

          // ✅ FIX 4 — sandbox (CRITICAL for Shopify)
        iframe.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
        );

          // ✅ FIX 5 — allow permissions
          iframe.setAttribute(
            "allow",
            "clipboard-write; microphone; camera"
          );

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

          // ✅ FIX 3 — Delay iframe injection
          setTimeout(() => {
            document.body.appendChild(iframe);
            console.log("[CHATBOT] iframe appended to DOM");
          }, 500);

          // ---------------------------
          // Toggle
          // ---------------------------
          btn.onclick = function () {
            iframe.style.display =
              iframe.style.display === 'none' ? 'block' : 'none';
          };

          // Debug events
          iframe.onload = () => {
            console.log("[CHATBOT] iframe loaded successfully");
          };

          iframe.onerror = () => {
            console.error("[CHATBOT] iframe failed to load");
          };

        })();
      })();
    `;

    return new Response(js, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response("console.error('Chatbot widget failed to load');", {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
      },
    });
  }
};

import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { type EntryContext } from "react-router";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";

// Helper to set dynamic CSP
function setDynamicCSP(request: Request, headers: Headers) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  let csp = `frame-ancestors https://*.myshopify.com https://admin.shopify.com https://shopify-app-95ky.onrender.com;`;

  if (shop && shop.includes(".myshopify.com")) {
    csp = `frame-ancestors https://${shop} https://admin.shopify.com https://shopify-app-95ky.onrender.com;`;
  }

  headers.set("Content-Security-Policy", csp);
  headers.set("X-Frame-Options", "ALLOW-FROM https://admin.shopify.com");
}

export const streamTimeout = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  addDocumentResponseHeaders(request, responseHeaders);

  // Set dynamic CSP for all HTML responses
  setDynamicCSP(request, responseHeaders);

  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";

  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html; charset=utf-8");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}

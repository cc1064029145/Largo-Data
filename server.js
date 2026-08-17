const http = require("node:http");

const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";
const maxBodyBytes = 1024 * 1024;

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/") {
    sendJson(response, 200, {
      ok: true,
      message: "Callback server is running",
      callback: "/callback",
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/callback") {
    const chunks = [];
    let receivedBytes = 0;

    request.on("data", (chunk) => {
      receivedBytes += chunk.length;
      if (receivedBytes > maxBodyBytes) {
        sendJson(response, 413, { ok: false, error: "Request body is too large" });
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      if (response.writableEnded) return;

      const rawBody = Buffer.concat(chunks).toString("utf8");
      let body = rawBody;

      if ((request.headers["content-type"] || "").includes("application/json")) {
        try {
          body = rawBody ? JSON.parse(rawBody) : {};
        } catch {
          sendJson(response, 400, { ok: false, error: "Invalid JSON" });
          return;
        }
      }

      console.log("Callback received", {
        time: new Date().toISOString(),
        contentType: request.headers["content-type"] || null,
        body,
      });

      sendJson(response, 200, { ok: true });
    });

    return;
  }

  sendJson(response, 404, { ok: false, error: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Callback server listening on http://${host}:${port}`);
});

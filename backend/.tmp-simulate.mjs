// Temporary: mimic how Vercel invokes the default export from server.js.
process.env.VERCEL = "1";
process.env.MONGODB_URI = "mongodb://127.0.0.1:1/does-not-exist";

const { default: handler } = await import("./server.js");
console.log("handler type:", typeof handler);

const request = { method: "GET", url: "/", headers: {}, on() {} };
let statusCode = 200;
const response = {
  status(code) {
    statusCode = code;
    return this;
  },
  json(payload) {
    console.log("RESPONDED", statusCode, JSON.stringify(payload));
  },
  end() {
    console.log("ENDED", statusCode);
  },
};

try {
  await handler(request, response);
} catch (error) {
  console.error("HANDLER THREW:", error.stack);
}

import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextRequest) {
  console.log("running stream handler");
  const signal = req.signal;
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const interval = setInterval(() => {
    const randomString = Math.random().toString(36).substring(2);
    console.log(`sending: ${`data: ${randomString}\n\n`}`);
    const encoder = new TextEncoder();
    writer.write(encoder.encode(`data: ${randomString}\n\n`));
  }, 1000);

  signal.addEventListener("abort", () => {
    // ! This is never called
    console.log("ABORTING");
    clearInterval(interval);
    writer.close();
  });

  new Promise((resolve) => setTimeout(resolve, 8000)).finally(() => {
    clearInterval(interval);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    }),
  });
}

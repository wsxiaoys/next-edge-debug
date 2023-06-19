import { NextRequest } from "next/server";

export const runtime = "edge";

export default function handler(req: NextRequest) {
  console.log("running stream handler");
  const stream = createStream(integers())

  return new Response(stream, {
    headers: new Headers({
      "Content-Type": "text/plain; charset=utf-8",
    }),
  });
}



async function* integers() {
  let i = 1
  const encoder = new TextEncoder();
  while (true) {
    console.log("yield", i)
    yield encoder.encode(`data: ${i++}\n\n`);
 
    await sleep(100)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
 
// Wraps a generator into a ReadableStream
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value)
      }
    },
  })
}

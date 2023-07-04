import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextRequest) {
  req.signal.addEventListener("abort", () => {
    console.log("aborted");
  });

  console.log("running stream handler");
  const stream = createStream(integers());

  return new Response(stream, {
    headers: new Headers({
      "Content-Type": "text/event-stream",
    }),
  });
}


let base = 0;
async function* integers() {
  base++;
  let i = 1
  const encoder = new TextEncoder();
  while (true) {
    const n = base * 100000 + i;
    i++;
    yield encoder.encode(`data: ${n}\n\n`);
 
    await sleep(100)
  }
}

function sleep(ms : any) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
 
// Wraps a generator into a ReadableStream
function createStream(iterator: any) {
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

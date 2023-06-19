import Link from "next/link";
import { useEffect, useState } from "react";

export default function StreamViewer() {
  const [streamText, setStreamText] = useState("");
  const [controller, setController] = useState<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setController(abortController);

    const fetchData = async () => {
      try {
        const response = await fetch("/api/stream", {
          signal: abortController.signal,
        });

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("ReadableStream not supported");
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          setStreamText((prevText) => prevText + new TextDecoder().decode(value));
          await sleep(1000);
        }
      } catch (error) {
        console.error("Error from stream:", error);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleStopStream = () => {
    if (controller) {
      controller.abort();
    }
  };

  return (
    <div style={{margin:"4rem"}}>
    <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
      Demo of Abort Signal not working with Edge (with fetch)
    </h1>
    <p style={{ fontSize: "16px", marginBottom: "8px" }}>
      Open the console and click the button to see the abort signal not working.
    </p>
    <button
      style={{
        fontSize: "16px",
        fontWeight: "bold",
        padding: "8px 16px",
        backgroundColor: "#007acc",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onClick={handleStopStream}
    >
      Stop Stream
    </button>
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Streamed Text:</h2>
      <pre style={{ fontSize: "14px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{streamText}</pre>
    </div>
   
  </div>
  );
}

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

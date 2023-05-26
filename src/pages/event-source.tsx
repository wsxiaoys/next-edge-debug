import Link from "next/link";
import { useEffect, useState } from "react";

export default function StreamViewer() {
  const [streamText, setStreamText] = useState("");
  const [stream, setStream] = useState<EventSource | null>(null);

  useEffect(() => {
    console.log("FIRING OFF STREAM REQUEST");
    const stream = new EventSource("/api/stream");
    setStream(stream);
    stream.onmessage = (event) => {
      console.log("Received message from stream:", event);
      setStreamText((prevText) => prevText + event.data);
    };

    stream.onerror = (event) => {
      console.error("Error from stream:", event);
      stream.close();
    };

    return () => {
      stream.close();
    };
  }, []);

  return (
    <div style={{margin:"4rem"}}>
        <a href="/" style={{ fontSize: "16px", marginBottom: "20px", color:"lightblue", textDecoration:"underline"  }}>
            To Fetch Demo 👉
        </a>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Demo of Abort Signal not working with Edge (with EventSource)</h1>
      <p style={{ fontSize: "16px", marginBottom: "8px" }}>Open the console and click the button to see the abort signal not working.</p>
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
        onClick={() => {
          if (stream) {
            console.log("Closing stream");
            stream.close();
            setStream(null);
          }
        }}
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

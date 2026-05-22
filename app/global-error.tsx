"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

// global-error.tsx replaces the root layout when it fires,
// so it must include <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt">
      <body
        style={{
          margin: 0,
          backgroundColor: "#0a0c10",
          color: "#fff",
          fontFamily: "sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100svh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ghost text */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30vw",
            fontWeight: 900,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.02)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ERR
        </span>

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw",
            maxWidth: "900px",
            height: "50vh",
            background: "radial-gradient(ellipse, rgba(0,166,240,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 24px",
            gap: 0,
          }}
        >
          <p
            style={{
              color: "rgba(239,68,68,0.7)",
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.6em",
              marginBottom: "24px",
            }}
          >
            Serviço Indisponível
          </p>

          <h1
            style={{
              fontSize: "clamp(3rem, 12vw, 9rem)",
              fontWeight: 900,
              fontStyle: "italic",
              textTransform: "uppercase",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              marginBottom: "24px",
            }}
          >
            Estamos a<br />
            <span style={{ color: "#00a6f0", textShadow: "0 0 60px rgba(0,166,240,0.4)" }}>
              trabalhar.
            </span>
          </h1>

          <div style={{ width: "64px", height: "1px", background: "rgba(255,255,255,0.1)", margin: "32px 0" }} />

          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", maxWidth: "380px", lineHeight: 1.7, marginBottom: "40px" }}>
            Os nossos conteúdos estão temporariamente indisponíveis. A equipa já está a resolver o problema — volte mais tarde.
          </p>

          {error.digest && (
            <p style={{ color: "rgba(255,255,255,0.12)", fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "32px" }}>
              #{error.digest}
            </p>
          )}

          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#00a6f0",
              color: "#fff",
              border: "none",
              padding: "16px 32px",
              fontSize: "11px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}

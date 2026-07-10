"use client";

// Catches errors thrown in the root layout itself; must render its own <html>.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0b08",
          color: "#e9e2d4",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 500 }}>
            HAURA scent
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#a89e8c" }}>
            Something went wrong. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "none",
              background: "#c9a86a",
              color: "#0d0b08",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: "0.72rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

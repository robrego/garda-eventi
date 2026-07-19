import { ImageResponse } from "next/og";

export const alt = "Lago di Garda e Dintorni – Eventi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1e4d54 0%, #2c6a72 60%, #3f9d5f 100%)",
        }}
      >
        <div style={{ display: "flex", gap: "18px", marginBottom: "36px" }}>
          <svg width="72" height="44" viewBox="0 0 42 26" fill="none">
            <path
              d="M3 9c4-3 8-3 12 0s8 3 12 0 8-3 12 0"
              stroke="#e2eeec"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M3 18c4-3 8-3 12 0s8 3 12 0 8-3 12 0"
              stroke="#bfe6c9"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Lago di Garda e Dintorni
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 500,
            color: "#e2eeec",
            marginTop: "24px",
          }}
        >
          Eventi, mercati e sagre giorno per giorno
        </div>
      </div>
    ),
    { ...size }
  );
}

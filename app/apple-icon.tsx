import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2c6a72",
        }}
      >
        <svg width="130" height="80" viewBox="0 0 42 26" fill="none">
          <path
            d="M3 9c4-3 8-3 12 0s8 3 12 0 8-3 12 0"
            stroke="#e2eeec"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M3 18c4-3 8-3 12 0s8 3 12 0 8-3 12 0"
            stroke="#3f9d5f"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lago di Garda e Dintorni – Eventi",
    short_name: "Lago di Garda",
    description: "Eventi, sagre, mercati e concerti sul Lago di Garda, giorno per giorno.",
    start_url: "/",
    display: "standalone",
    background_color: "#e2eeec",
    theme_color: "#2c6a72",
    lang: "it",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

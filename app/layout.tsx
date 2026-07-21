import type { Metadata } from "next";
import { Bricolage_Grotesque, Work_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/siteUrl";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});

const title = "Lago di Garda e Dintorni – Eventi";
const description =
  "Sagre, mercati, concerti e feste sul Lago di Garda: Lombardia, Veneto e Trentino. Eventi di oggi e dei prossimi giorni, aggiornati ogni settimana.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: { title, description, url: "/", siteName: title, locale: "it_IT", type: "website" },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    // Explicit list, not the app/icon.* file convention: Next only emits one
    // <link rel="icon"> when multiple same-named files exist (it picked PNG
    // over SVG silently), so both are named as static /public assets and
    // declared here instead to get both tags — Google's search-result
    // favicon crawler has documented inconsistent SVG-only support, so a
    // PNG fallback needs to actually be present in the HTML, not just exist
    // as an unreferenced file.
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bricolage.variable} ${workSans.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

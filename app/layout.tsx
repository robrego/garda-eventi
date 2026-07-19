import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/siteUrl";

const title = "Lago di Garda e Dintorni – Eventi";
const description =
  "Sagre, mercati, concerti e feste sul Lago di Garda: Lombardia, Veneto e Trentino. Eventi di oggi e dei prossimi giorni, aggiornati ogni settimana.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: { title, description, url: "/", siteName: title, locale: "it_IT", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

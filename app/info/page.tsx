import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import UsefulInfoPage from "@/components/UsefulInfoPage";
import { translate } from "@/lib/i18n";

export const metadata: Metadata = {
  title: translate("usefulInfoTitle", "it"),
  description: translate("usefulInfoSubtitle", "it"),
  alternates: { canonical: "/info" },
};

export default function Info() {
  return (
    <LanguageProvider>
      <UsefulInfoPage />
    </LanguageProvider>
  );
}

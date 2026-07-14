import { LanguageProvider } from "@/components/LanguageProvider";
import UsefulInfoPage from "@/components/UsefulInfoPage";

export default function Info() {
  return (
    <LanguageProvider>
      <UsefulInfoPage />
    </LanguageProvider>
  );
}

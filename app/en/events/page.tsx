import type { Metadata } from "next";
import { translate } from "@/lib/i18n";
import TownDirectoryBody from "@/components/TownDirectoryBody";

export const metadata: Metadata = {
  title: translate("townsIndexTitle", "en"),
  description: translate("townsIndexSubtitle", "en"),
  alternates: {
    canonical: "/en/events",
    languages: { it: "/eventi", en: "/en/events", "x-default": "/eventi" },
  },
};

export default function TownsIndexPageEn() {
  return <TownDirectoryBody lang="en" siblingHref="/eventi" mapHref="/" townHrefBase="/en/events" />;
}

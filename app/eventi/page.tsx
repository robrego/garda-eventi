import type { Metadata } from "next";
import { translate } from "@/lib/i18n";
import TownDirectoryBody from "@/components/TownDirectoryBody";

export const metadata: Metadata = {
  title: translate("townsIndexTitle", "it"),
  description: translate("townsIndexSubtitle", "it"),
  alternates: {
    canonical: "/eventi",
    languages: { it: "/eventi", en: "/en/events", "x-default": "/eventi" },
  },
};

export default function TownsIndexPage() {
  return <TownDirectoryBody lang="it" siblingHref="/en/events" mapHref="/" townHrefBase="/eventi" />;
}

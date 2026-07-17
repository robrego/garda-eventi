import Link from "next/link";
import { groupTownsByArea } from "@/data/config";
import { slugifyTown } from "@/lib/townSlugs";
import { translate, type Lang } from "@/lib/i18n";
import SeoPageHeader from "@/components/SeoPageHeader";

export default function TownDirectoryBody({
  lang,
  siblingHref,
  mapHref,
  townHrefBase,
}: {
  lang: Lang;
  siblingHref: string;
  mapHref: string;
  /** e.g. "/eventi" or "/en/events" — town links are built as `${townHrefBase}/${slug}`. */
  townHrefBase: string;
}) {
  const groups = groupTownsByArea(lang);

  return (
    <div className="app">
      <SeoPageHeader lang={lang} siblingHref={siblingHref} mapHref={mapHref} townsIndexHref={townHrefBase} />

      <Link href={mapHref} className="info-back-link">
        {translate("backToMap", lang)}
      </Link>

      <h1 className="info-page-title">{translate("townsIndexTitle", lang)}</h1>
      <p className="info-page-subtitle">{translate("townsIndexSubtitle", lang)}</p>

      <div className="town-directory">
        {groups.map(({ area, towns }) => (
          <div key={area} className="town-directory-group">
            <div className="town-directory-area">{area}</div>
            <div className="town-directory-links">
              {towns.map((town) => (
                <Link key={town} href={`${townHrefBase}/${slugifyTown(town)}`} className="town-directory-link">
                  {town}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

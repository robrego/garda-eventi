import { Fragment } from "react";
import Link from "next/link";
import { BedDouble } from "lucide-react";
import type { EventItem } from "@/data/config";
import { translate, townMetaTitle, townMetaDescription, type Lang } from "@/lib/i18n";
import { formatDate, dateFromISO } from "@/components/EventDisplay";
import { groupEventsByDate } from "@/lib/townPageData";
import { buildEventJsonLd, buildBreadcrumbJsonLd, jsonLdScriptProps } from "@/lib/eventJsonLd";
import { SITE_URL } from "@/lib/siteUrl";
import { TOWN_PARTNERS } from "@/data/townPartners";
import TownEventCard from "@/components/TownEventCard";
import SeoPageHeader from "@/components/SeoPageHeader";

export default function TownPageBody({
  town,
  lang,
  events,
  siblingHref,
  indexHref,
  mapHref,
  pageUrl,
}: {
  town: string;
  lang: Lang;
  events: EventItem[];
  /** This same page's URL in the other language. */
  siblingHref: string;
  /** The town directory index, in this page's language. */
  indexHref: string;
  /** The interactive map/list app, in this page's language. */
  mapHref: string;
  /** Absolute canonical URL of this page, used for JSON-LD @id values. */
  pageUrl: string;
}) {
  const grouped = groupEventsByDate(events);
  const partner = TOWN_PARTNERS[town];
  const jsonLd = buildEventJsonLd(events, town, lang, pageUrl);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    town,
    lang,
    homeUrl: `${SITE_URL}${mapHref}`,
    indexUrl: `${SITE_URL}${indexHref}`,
    pageUrl,
  });

  return (
    <div className="app">
      <SeoPageHeader lang={lang} siblingHref={siblingHref} mapHref={mapHref} />

      <Link href={indexHref} className="info-back-link">
        {translate("backToTowns", lang)}
      </Link>

      <h1 className="info-page-title">{townMetaTitle(town, lang)}</h1>
      <p className="info-page-subtitle">{townMetaDescription(town, lang)}</p>

      <Link href={mapHref} className="add-event-btn add-event-btn-outline seo-map-cta">
        {translate("viewInteractiveMap", lang)}
      </Link>

      {grouped.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">〜</div>
          <p>
            {translate("emptyStateLine1", lang)}
            <br />
            {translate("emptyStateLine2", lang)}
          </p>
        </div>
      ) : (
        <div className="list-col">
          {grouped.map(({ date, events: dayEvents }) => (
            <Fragment key={date}>
              <div className="date-heading">{formatDate(dateFromISO(date), lang)}</div>
              {dayEvents.map((e) => (
                <TownEventCard key={e.id} event={e} lang={lang} />
              ))}
            </Fragment>
          ))}
        </div>
      )}

      {partner && (
        <div className="town-partner">
          <div className="date-heading">{translate("whereToStay", lang)}</div>
          <a href={partner.url} target="_blank" rel="noopener noreferrer" className="info-card">
            <div className="info-card-icon icon-stay" aria-hidden="true">
              <BedDouble size={24} strokeWidth={1.75} />
            </div>
            <div className="info-card-body">
              <h3>{partner.name}</h3>
              <p>{lang === "en" ? partner.descEn : partner.desc}</p>
              <span className="info-card-link">{partner.url.replace(/^https?:\/\//, "")}</span>
            </div>
          </a>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(jsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbJsonLd)}
      />
    </div>
  );
}

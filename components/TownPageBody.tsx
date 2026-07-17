import { Fragment } from "react";
import Link from "next/link";
import type { EventItem } from "@/data/config";
import { translate, townMetaTitle, townMetaDescription, type Lang } from "@/lib/i18n";
import { formatDate, dateFromISO } from "@/components/EventDisplay";
import { groupEventsByDate } from "@/lib/townPageData";
import { buildEventJsonLd, jsonLdScriptProps } from "@/lib/eventJsonLd";
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
  const jsonLd = buildEventJsonLd(events, town, lang, pageUrl);

  return (
    <div className="app">
      <SeoPageHeader lang={lang} siblingHref={siblingHref} mapHref={mapHref} townsIndexHref={indexHref} />

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(jsonLd)}
      />
    </div>
  );
}

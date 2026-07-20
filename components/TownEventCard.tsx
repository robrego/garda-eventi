import Image from "next/image";
import { EventItem, CATEGORIES, CATEGORIES_EN, translateTime } from "@/data/config";
import { LinkArrowIcon, CoverPlaceholder } from "@/components/EventDisplay";
import { translate, type Lang } from "@/lib/i18n";
import { isOptimizableImageHost } from "@/lib/imageHosts";

// Read-only counterpart to EventList's event card, for the static/SEO town
// pages: no select/edit/delete/cover-upload affordances, so it's a plain
// Server Component with no client JS shipped.
export default function TownEventCard({ event: e, lang }: { event: EventItem; lang: Lang }) {
  return (
    <div className="event-card event-card-static" id={`card-${e.id}`}>
      <div className="event-card-body">
        <div className="event-cover-col">
          {e.image ? (
            <Image
              src={e.image}
              alt={lang === "en" ? e.titleEn ?? e.title : e.title}
              className="event-cover"
              width={92}
              height={130}
              unoptimized={!isOptimizableImageHost(e.image)}
            />
          ) : (
            <div className="event-cover-placeholder" aria-hidden="true">
              <CoverPlaceholder town={e.town} />
            </div>
          )}
          <div className={`event-cat event-cat-mobile cat-${e.cat}`}>
            {lang === "en" ? CATEGORIES_EN[e.cat] : CATEGORIES[e.cat]}
          </div>
        </div>
        <div className="event-main">
          <div className="event-top">
            <div>
              <p className="event-name">
                {e.url ? (
                  <a href={e.url} target="_blank" rel="noopener noreferrer">
                    {lang === "en" ? e.titleEn ?? e.title : e.title}
                    <LinkArrowIcon />
                  </a>
                ) : lang === "en" ? (
                  e.titleEn ?? e.title
                ) : (
                  e.title
                )}
              </p>
              <div className="event-meta">
                {e.town} · {translateTime(e.time, lang)}
              </div>
            </div>
            <div className={`event-cat event-cat-desktop cat-${e.cat}`}>
              {lang === "en" ? CATEGORIES_EN[e.cat] : CATEGORIES[e.cat]}
            </div>
          </div>
          <div className="event-desc">{lang === "en" ? e.descEn ?? e.desc : e.desc}</div>
        </div>
      </div>
    </div>
  );
}

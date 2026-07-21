// `as` lets pages that already have their own <h1> (e.g. the SEO town
// pages, where the town name should be the page's one true h1) render the
// brand name as a plain paragraph instead, without duplicating the logo SVG.
// `title` lets a page swap the brand text for its own name (e.g. "Trasporti"
// on /info) instead of the default site title.
export default function BrandMark({
  as: Tag = "h1",
  title = "Eventi sul Garda",
}: {
  as?: "h1" | "p";
  title?: string;
}) {
  return (
    <div className="brand-mark">
      <svg width="46" height="28" viewBox="0 0 42 26" fill="none">
        <path d="M3 9c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="#1e4d54" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M3 18c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="#2c6a72" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
      <Tag className="brand-mark-text">{title}</Tag>
    </div>
  );
}

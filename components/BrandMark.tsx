// `as` lets pages that already have their own <h1> (e.g. the SEO town
// pages, where the town name should be the page's one true h1) render the
// brand name as a plain paragraph instead, without duplicating the logo SVG.
export default function BrandMark({ as: Tag = "h1" }: { as?: "h1" | "p" }) {
  return (
    <div className="brand-mark">
      <svg width="46" height="28" viewBox="0 0 42 26" fill="none">
        <path d="M3 9c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="#2c6a72" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M3 18c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="#3f9d5f" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
      <Tag className="brand-mark-text">Lago di Garda</Tag>
    </div>
  );
}

import { TOWNS } from "@/data/config";

export function slugifyTown(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (Salò -> Salo)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SLUG_TO_TOWN = new Map(TOWNS.map((town) => [slugifyTown(town), town]));

export function townFromSlug(slug: string): string | undefined {
  return SLUG_TO_TOWN.get(slug);
}

import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Serves uploaded cover images publicly even though they're stored as
// "private" blobs (see lib/uploadImage.ts) — this route holds the only
// credential (BLOB_READ_WRITE_TOKEN) that can read them, and re-streams the
// bytes to whoever asks, no session required. Deliberately no auth check:
// covers are meant to be visible to every visitor, same as any other image
// on the page.
export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const pathname = params.path.join("/");
  // The cover preview in AddCoverForm requests this same URL immediately
  // after the client-side upload() promise resolves — right at the edge of
  // Vercel Blob's read-after-write window, where `get()` can still 404 for
  // a moment. A few short retries absorb that instead of showing a broken
  // image (which just reveals .cover-preview's empty background, looking
  // like the app "broke").
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const result = await get(pathname, { access: "private" });
      if (result?.stream) {
        return new NextResponse(result.stream, {
          headers: {
            "Content-Type": result.blob.contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // fall through to retry/404 below
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  return new NextResponse(null, { status: 404 });
}

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
  try {
    const result = await get(pathname, { access: "private" });
    if (!result?.stream) return new NextResponse(null, { status: 404 });
    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

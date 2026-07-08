import { upload } from "@vercel/blob/client";

// Shared by AddCoverForm and AddEventForm: uploads directly from the browser
// to Vercel Blob (bypassing our server, per the client-upload pattern — see
// app/api/upload/route.ts for the token-issuing side).
//
// This project's Blob store only allows private blobs (every other use —
// users, manual events, overrides — is deliberately private), so covers are
// uploaded private too, then served back through app/api/cover/[...path],
// which is the only thing allowed to read them with our server's token.
// That keeps the underlying blob "private" in Vercel's sense while still
// being a stable, public, no-expiry URL for anonymous visitors — no need
// for a second Blob store or a dashboard change.
export async function uploadImage(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: "private",
    handleUploadUrl: "/api/upload",
  });
  return `/api/cover/${blob.pathname}`;
}

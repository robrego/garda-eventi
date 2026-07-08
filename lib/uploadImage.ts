import { upload } from "@vercel/blob/client";

// Shared by AddCoverForm and AddEventForm: uploads directly from the browser
// to Vercel Blob (bypassing our server, per the client-upload pattern — see
// app/api/upload/route.ts for the token-issuing side) and returns a public
// URL that can't go dead the way a pasted external link can.
export async function uploadImage(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  return blob.url;
}

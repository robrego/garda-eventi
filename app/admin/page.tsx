import { getSessionEmail, isAdminEmail } from "@/lib/auth";
import { readManualEvents } from "@/lib/manualEvents";
import { readHiddenEvents } from "@/lib/hiddenEvents";
import { readImageOverrides } from "@/lib/imageOverrides";
import { readDescOverrides } from "@/lib/descOverrides";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const email = await getSessionEmail();
  if (!isAdminEmail(email)) {
    return (
      <div className="app">
        <p style={{ padding: "40px 0" }}>Accesso negato.</p>
      </div>
    );
  }

  const [manual, hidden, images, descs] = await Promise.all([
    readManualEvents(),
    readHiddenEvents(),
    readImageOverrides(),
    readDescOverrides(),
  ]);

  return <AdminDashboard manual={manual} hidden={hidden} images={images} descs={descs} />;
}

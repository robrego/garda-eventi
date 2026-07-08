"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddEventForm from "@/components/AddEventForm";
import { useLang } from "@/components/LanguageProvider";

export default function AuthWidget({
  email,
  onEmailChange,
}: {
  email: string | null | undefined;
  onEmailChange: (email: string | null) => void;
}) {
  const router = useRouter();
  const { t } = useLang();
  const [showAuth, setShowAuth] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail, password: formPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("errorGeneric"));
        setBusy(false);
        return;
      }
      onEmailChange(data.email);
      setShowAuth(false);
      setFormEmail("");
      setFormPassword("");
      router.refresh();
      if (pendingAdd) {
        setPendingAdd(false);
        setShowAdd(true);
      }
    } catch {
      setError(t("errorConnection"));
    }
    setBusy(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    onEmailChange(null);
    router.refresh();
  };

  if (email === undefined) return null;

  return (
    <>
      <div className="auth-widget">
        {email ? (
          <>
            <button type="button" className="add-event-btn" onClick={() => setShowAdd(true)}>
              {t("authAddEvent")}
            </button>
            <button type="button" className="auth-link" onClick={logout}>
              {t("authLogout")}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="add-event-btn"
            onClick={() => {
              setPendingAdd(true);
              setMode("register");
              setShowAuth(true);
            }}
          >
            {t("authRegister")}
          </button>
        )}
      </div>

      {showAuth && (
        <div className="modal-backdrop" onClick={() => setShowAuth(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{mode === "login" ? t("authLogin") : t("authRegister")}</h2>

            <label className="form-field">
              {t("fieldEmail")}
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="form-field">
              {t("fieldPassword")}
              <input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <div className="modal-actions">
              <button type="button" className="modal-primary" onClick={submit} disabled={busy}>
                {mode === "login" ? t("authLogin") : t("authCreateAccount")}
              </button>
              <button type="button" className="modal-close" onClick={() => setShowAuth(false)}>
                {t("authCancel")}
              </button>
            </div>

            <button
              type="button"
              className="modal-switch"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
            >
              {mode === "login" ? t("authSwitchToRegister") : t("authSwitchToLogin")}
            </button>
          </div>
        </div>
      )}

      {showAdd && email && (
        <AddEventForm
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

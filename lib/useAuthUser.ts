"use client";

import { useEffect, useState } from "react";

export function useAuthUser() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setEmail(d.email);
        setIsAdmin(!!d.isAdmin);
      })
      .catch(() => setEmail(null));
  }, []);

  const handleEmailChange = (newEmail: string | null) => {
    setEmail(newEmail);
    if (!newEmail) {
      setIsAdmin(false);
      return;
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d.isAdmin))
      .catch(() => setIsAdmin(false));
  };

  return { email, isAdmin, handleEmailChange };
}

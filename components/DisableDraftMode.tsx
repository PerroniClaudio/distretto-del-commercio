"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { disableDraftMode } from "@/app/actions";

export function DisableDraftMode() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (window === window.parent && !window.opener) {
      setShowButton(true);
    }
  }, []);

  if (!showButton) {
    return null;
  }

  const disable = () =>
    startTransition(async () => {
      await disableDraftMode();
      router.refresh();
    });

  return (
    <div>
      {pending ? (
        "Disabilitando modalità bozza..."
      ) : (
        <button type="button" onClick={disable}>
          Disabilita modalità bozza
        </button>
      )}
    </div>
  );
}

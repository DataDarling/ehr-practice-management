"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.1s" }}>
        {children}
      </div>
    </SessionProvider>
  );
}

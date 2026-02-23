"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
    return () => {
      setTheme("system");
    };
  }, [setTheme]);

  return <>{children}</>;
}

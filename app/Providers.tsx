"use client";

import AppContextProvider from "@/context/app-context";

function Providers({ children }: { children: React.ReactNode }) {
  return <AppContextProvider>{children}</AppContextProvider>;
}

export default Providers;

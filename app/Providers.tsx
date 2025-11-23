"use client";

import AppContextProvider from "@/context/app-context";
import { TooltipProvider } from "@/components/ui/tooltip";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </TooltipProvider>
  );
}

export default Providers;

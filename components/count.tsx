"use client";

import { useEffect, useState } from "react";
import { CopyIcon } from "@radix-ui/react-icons";

import { useAppContext } from "@/context/app-context";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

function Count({ count }: { count: number }) {
  const [isMounted, setIsMounted] = useState(false);
  const { state } = useAppContext();
  const [_, copy] = useCopyToClipboard();
  const toDisplay = state.status === "not-loaded" ? count : state.total;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div className="text-center">
      {!isMounted || state.status === "loading" ? (
        <>
          <Skeleton className="h-6 w-48 mx-auto mt-2" />
          <Skeleton className="h-8 w-20 mx-auto mt-2" />
        </>
      ) : (
        <>
          <p className="text-xl">
            Total{" "}
            <span className="underline underline-offset-2">
              {state.package}
            </span>{" "}
            downloads
          </p>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  onClick={() => copy(toDisplay.toString())}
                  className="mt-2 cursor-pointer flex items-center justify-center gap-2 text-[var(--hero-red)]"
                >
                  <span className="text-4xl  font-medium">
                    {toDisplay.toLocaleString()}
                  </span>
                  <CopyIcon height={24} width={24} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy it!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
}

export default Count;

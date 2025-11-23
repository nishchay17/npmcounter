"use client";

import { useEffect, useState } from "react";
import { CopyIcon } from "@radix-ui/react-icons";

import { useAppContext } from "@/context/app-context";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

function Count({ count }: { count: number }) {
  const [isMounted, setIsMounted] = useState(false);
  const { state } = useAppContext();
  const [, copy] = useCopyToClipboard();
  const toDisplay = state.status === "not-loaded" ? count : state.total;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="text-center">
      {!isMounted || state.status === "loading" ? (
        <>
          <Skeleton className="h-6 w-48 mx-auto mt-2" />
          <Skeleton className="h-8 w-20 mx-auto mt-2" />
        </>
      ) : state.status === "error" ? (
        <p className="text-base sm:text-lg md:text-xl text-hero-red">
          {state.message}
        </p>
      ) : (
        <>
          <p className="text-base sm:text-lg md:text-xl">
            Total{" "}
            <span className="underline underline-offset-2">
              {state.package}
            </span>{" "}
            downloads
          </p>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => copy(toDisplay.toString())}
                className="mt-2 mx-auto cursor-pointer flex items-center justify-center gap-2 text-[var(--hero-red)] bg-transparent border-none hover:opacity-80 transition-opacity"
                aria-label="Copy download count to clipboard"
              >
                <span className="text-2xl sm:text-3xl md:text-4xl font-medium">
                  {toDisplay.toLocaleString()}
                </span>
                <CopyIcon height={24} width={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Copy it!</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}

export default Count;

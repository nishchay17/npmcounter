"use client";

import { useAppContext } from "@/context/app-context";

function Count({ count }: { count: number }) {
  const {
    state: { total },
  } = useAppContext();
  const toDisplay = total ?? count;
  return (
    <p className="text-center">Total downloads: {toDisplay.toLocaleString()}</p>
  );
}

export default Count;

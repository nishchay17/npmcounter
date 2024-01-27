"use client";

import { useAppContext } from "@/context/app-context";

function Count({ count }: { count: number }) {
  const {
    state: { total, status },
  } = useAppContext();
  const toDisplay = status === "not-loaded" ? count : total;
  return (
    <p className="text-center">Total downloads: {toDisplay.toLocaleString()}</p>
  );
}

export default Count;

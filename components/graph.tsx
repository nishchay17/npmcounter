"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import colors from "tailwindcss/colors";

import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/app-context";
import { Skeleton } from "./ui/skeleton";

export default function Graph({ data }: any) {
  const [isMounted, setIsMounted] = useState(false);
  const { state } = useAppContext();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <Card>
      <CardContent className="py-4">
        <div className="h-[350px] md:h-[250px]">
          {!isMounted ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={state.status === "not-loaded" ? data.data : state.data}
              >
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].payload.day}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Downloads
                              </span>
                              <span className="font-bold text-[var(--hero-red)]">
                                {payload[0].payload.downloads}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="downloads"
                  style={
                    {
                      stroke: colors.neutral[500],
                    } as React.CSSProperties
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

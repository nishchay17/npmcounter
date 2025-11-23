"use client";

import { useEffect, useState, useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import colors from "tailwindcss/colors";

import { Card, CardContent } from "@/components/ui/card";
import { useAppContext, RangeDataType } from "@/context/app-context";
import { Skeleton } from "./ui/skeleton";
import { shrinkRangeData } from "@/lib/utils";

type GraphProps = {
  data: {
    data: RangeDataType[];
    total: number;
    range: string;
    package: string;
  };
};

export default function Graph({ data }: GraphProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { state } = useAppContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shrunkenData = useMemo(
    () =>
      shrinkRangeData(
        state.status === "not-loaded" ? data.data : state.data ?? []
      ),
    [state.status, state.data, data.data]
  );

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-center h-[350px] md:h-[250px]">
          {!isMounted ? (
            <Skeleton className="h-full w-full" />
          ) : shrunkenData.length === 0 ? (
            <p className="text-lg">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shrunkenData}>
                <Tooltip
                  content={({ active, payload }) => {
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

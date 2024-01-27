"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getStats, { TIMEFRAMES } from "@/lib/fetchStats";
import isRangeValid from "@/lib/validateRange";
import { searchSchema } from "@/lib/schema/searchSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAppContext } from "@/context/app-context";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [_, setFlag] = useState(false);
  const { dispatch } = useAppContext();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      package: searchParams.get("package") ?? "",
      range: isRangeValid(searchParams.get("range")) ?? "last month",
    },
  });

  useEffect(() => {
    (async () => {
      if (searchParams.get("package") && searchParams.get("range")) {
        const data = await getStats({
          package: searchParams.get("package") ?? "",
          range: isRangeValid(searchParams.get("range")) ?? "last month",
        });
        dispatch({
          type: "replace-all",
          payload: { ...data, status: "loaded" },
        });
      }
    })();
  }, []);

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    const params = new URLSearchParams(searchParams);
    params.set("range", values.range);
    params.set("package", values.package);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    const data = await getStats(values);
    dispatch({ type: "replace-all", payload: { ...data, status: "loaded" } });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full mx-auto max-w-md items-start space-x-2">
          <FormField
            control={form.control}
            name="package"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="React"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Search</Button>
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          {Object.keys(TIMEFRAMES).map((timerange) => (
            <Button
              variant={
                form.getValues("range") !== timerange ? "ghost" : "outline"
              }
              size="sm"
              type="button"
              key={timerange}
              onClick={() => {
                // this will not render, so adding additional state
                setFlag((f) => !f);
                form.setValue("range", timerange);
              }}
            >
              {timerange}
            </Button>
          ))}
        </div>
      </form>
    </Form>
  );
}

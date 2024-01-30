"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getStats, { TIMEFRAMES } from "@/lib/fetchStats";
import { searchSchema } from "@/lib/schema/searchSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { States, useAppContext } from "@/context/app-context";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { dispatch } = useAppContext();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      package: searchParams.get("package") ?? "",
      range: searchParams.get("range") ?? "last month",
    },
  });

  useEffect(() => {
    (async () => {
      const pkg = searchParams.get("package");
      const range = searchParams.get("range");
      if (pkg || (pkg && range)) {
        dispatch({ type: "loading" });
        try {
          const data = await getStats({
            package: searchParams.get("package") ?? "",
            range: searchParams.get("range") ?? "last month",
          });
          dispatch({
            type: "replace-all",
            payload: { ...data, status: States.LOADED },
          });
        } catch (error) {
          dispatch({
            type: "error",
            payload: { message: (error as Error).message },
          });
        }
      }
    })();
  }, [dispatch, searchParams]);

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    dispatch({ type: "loading" });
    try {
      const data = await getStats(values);
      const params = new URLSearchParams(searchParams);
      params.set("range", values.range);
      params.set("package", values.package);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      dispatch({
        type: "replace-all",
        payload: { ...data, status: States.LOADED },
      });
    } catch (error) {
      dispatch({
        type: "error",
        payload: { message: (error as Error).message },
      });
    }
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Search
          </Button>
        </div>
        <div className="flex justify-center space-x-2 mt-4 flex-wrap">
          {[...Object.keys(TIMEFRAMES), "all time"].map((timerange) => (
            <Button
              variant={
                form.getValues("range") !== timerange ? "ghost" : "outline"
              }
              size="sm"
              type="submit"
              key={timerange}
              onClick={() => {
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

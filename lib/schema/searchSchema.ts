"use client";

import * as z from "zod";

export const searchSchema = z.object({
  package: z.string().min(1, "Please enter a package name").max(50),
  range: z.string().min(2).max(50),
});

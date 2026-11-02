import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import {
  hadithByCode,
  hadithKitabOptions,
  homeHadithData,
  listHadiths,
  type ListInput,
} from "./hadiths.functions";

export const hadithListQuery = (input: ListInput) =>
  queryOptions({
    queryKey: ["hadiths", "list", input],
    queryFn: () => listHadiths({ data: input }),
    placeholderData: (previous) => previous,
  });

export const hadithKitabQuery = queryOptions({
  queryKey: ["hadiths", "kitab"],
  queryFn: () => hadithKitabOptions(),
  staleTime: 60_000,
});

export const hadithDetailQuery = (code: string) =>
  queryOptions({
    queryKey: ["hadiths", "detail", code],
    queryFn: async () => {
      const detail = await hadithByCode({ data: { code } });
      if (!detail) throw notFound();
      return detail;
    },
    retry: false,
  });

export const homeHadithQuery = queryOptions({
  queryKey: ["hadiths", "home"],
  queryFn: () => homeHadithData(),
  staleTime: 30_000,
});

import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { cleanSearch } from "@/lib/hadith-search";
import { mapSignStatus, signPosition } from "@/lib/sign-layout";

// The Home map and the hadith library read from Supabase, so the rules that
// decide what a visitor sees are checked here without a network call.
describe("Hadith library and Home map", () => {
  it("maps database sign statuses onto the three map badge states", () => {
    expect(mapSignStatus("sudah_terjadi")).toBe("done");
    expect(mapSignStatus("sedang_berlangsung")).toBe("ongoing");
    expect(mapSignStatus("belum_terjadi")).toBe("future");
    expect(mapSignStatus(null)).toBe("future");
  });

  it("spreads signs across the map canvas in display order", () => {
    const first = signPosition(0, 9);
    const middle = signPosition(4, 9);
    const last = signPosition(8, 9);

    expect(first.x).toBeLessThan(middle.x);
    expect(middle.x).toBeLessThan(last.x);
    expect(middle.y).toBeLessThan(first.y);
    expect(last.x).toBeGreaterThan(90);
  });

  it("keeps a typed search term out of the filter syntax", () => {
    // A comma would split the search into separate database filters.
    expect(cleanSearch("riba, (dajjal) *isa*")).toBe("riba dajjal isa");
    expect(cleanSearch("   riba   ")).toBe("riba");
    expect(cleanSearch("")).toBe("");
  });

  it("matches the library and the hadith detail page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    expect(router.matchRoutes("/hadits").at(-1)?.routeId).not.toBe(rootRouteId);
    expect(router.matchRoutes("/hadits/H001").at(-1)?.routeId).not.toBe(rootRouteId);
  });
});

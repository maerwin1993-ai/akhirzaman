import { describe, expect, it } from "vitest";

import {
  FASE_LIST,
  KITA_DI_SINI_NODE_ID,
  TIMELINE_NODES,
  ayatUrl,
  getVisibleTimeline,
  type TimelineNode,
} from "@/lib/timeline-data";

describe("timeline data", () => {
  it("keeps nodes in order with unique ids and known phases", () => {
    const urutan = TIMELINE_NODES.map((n) => n.urutan);
    expect(urutan).toEqual([...urutan].sort((a, b) => a - b));
    expect(new Set(TIMELINE_NODES.map((n) => n.id)).size).toBe(TIMELINE_NODES.length);
    const fase = new Set(FASE_LIST.map((f) => f.fase));
    expect(TIMELINE_NODES.every((n) => fase.has(n.fase))).toBe(true);
  });

  it("ships every node unreviewed and without evidence until the ustadz fills it", () => {
    expect(TIMELINE_NODES.every((n) => n.reviewed === false)).toBe(true);
    expect(TIMELINE_NODES.every((n) => n.dalil.length === 0)).toBe(true);
  });

  it("matches the planned timeline_nodes column shape", () => {
    const keys = Object.keys(TIMELINE_NODES[0]).sort();
    expect(keys).toEqual(["dalil", "fase", "id", "judul_en", "judul_id", "reviewed", "ringkasan", "urutan"]);
  });

  it("anchors the 'here' marker to an existing node", () => {
    expect(TIMELINE_NODES.some((n) => n.id === KITA_DI_SINI_NODE_ID)).toBe(true);
  });
});

describe("getVisibleTimeline", () => {
  it("shows only the phase skeleton in production while nothing is reviewed", () => {
    const { nodes, fase } = getVisibleTimeline(TIMELINE_NODES, { showDrafts: false });
    expect(nodes).toHaveLength(0);
    expect(fase).toHaveLength(FASE_LIST.length);
    expect(fase.every((f) => f.nodes.length === 0)).toBe(true);
  });

  it("renders only reviewed nodes in production", () => {
    const reviewed: TimelineNode = { ...TIMELINE_NODES[0], reviewed: true };
    const { nodes } = getVisibleTimeline([reviewed, TIMELINE_NODES[1]], { showDrafts: false });
    expect(nodes.map((n) => n.id)).toEqual([reviewed.id]);
  });

  it("includes drafts when showDrafts is on", () => {
    const { nodes } = getVisibleTimeline(TIMELINE_NODES, { showDrafts: true });
    expect(nodes).toHaveLength(TIMELINE_NODES.length);
  });

  it("defaults to hiding drafts", () => {
    expect(getVisibleTimeline(TIMELINE_NODES).nodes).toHaveLength(0);
  });
});

describe("ayatUrl", () => {
  it("builds a link for a valid surah:ayat", () => {
    expect(ayatUrl("2:30")).toBe("https://quran.com/2/30");
  });

  it("rejects malformed or out-of-range references", () => {
    expect(ayatUrl("115:1")).toBeNull();
    expect(ayatUrl("0:1")).toBeNull();
    expect(ayatUrl("2:0")).toBeNull();
    expect(ayatUrl("al-Baqarah 30")).toBeNull();
  });
});

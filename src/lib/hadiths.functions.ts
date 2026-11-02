import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type SignRow = Pick<
  Database["public"]["Tables"]["signs"]["Row"],
  "id" | "slug" | "nama" | "deskripsi_singkat" | "kategori" | "status" | "urutan"
>;

export const KATEGORI = ["tanda_kecil", "tanda_besar", "fitnah", "akhirat", "umum"] as const;
export const HADITH_STATUS = ["sudah_terjadi", "sedang_berlangsung", "belum_terjadi", "tidak_berlaku"] as const;

export type HadithListItem = {
  code: string;
  tema: string | null;
  teks_arab: string;
  matan_ringkas_id: string | null;
  matan_ringkas_en: string | null;
  terjemah_id: string | null;
  terjemah_en: string | null;
  status: string | null;
  kategori: string | null;
  derajat: string | null;
  kitab: string | null;
  nomor: string | null;
};

export type HadithDetail = HadithListItem & {
  bab: string | null;
  jenis: string | null;
  penilai_derajat: string | null;
  terjemah_id: string | null;
  terjemah_en: string | null;
  syarah_ringkas: string | null;
  rujukan_syarah: string | null;
  link_sumber: string | null;
  verified_by: string | null;
  verified_at: string | null;
  signs: { slug: string; nama: string }[];
};

export type HadithListResult = {
  items: HadithListItem[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
};

export type HomeSign = {
  slug: string;
  nama: string;
  deskripsi_singkat: string | null;
  kategori: string | null;
  status: string | null;
  urutan: number;
  hadithCount: number;
};

export type HomeData = { featured: HadithListItem | null; signs: HomeSign[] };

export type ListInput = {
  q?: string;
  kategori?: string;
  status?: string;
  kitab?: string;
  sign?: string;
  page?: number;
};

const LIST_COLS =
  "code, tema, teks_arab, matan_ringkas_id, matan_ringkas_en, terjemah_id, terjemah_en, status, kategori, derajat, kitab, nomor";

const DETAIL_COLS =
  "code, tema, teks_arab, matan_ringkas_id, matan_ringkas_en, status, kategori, derajat, kitab, nomor, bab, jenis, penilai_derajat, terjemah_id, terjemah_en, syarah_ringkas, rujukan_syarah, link_sumber, verified_by, verified_at";

/**
 * Public read-only client. Every policy behind it only lets signed-out
 * visitors see rows where is_published is true, so nothing unpublished
 * can come back through this path.
 */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
      },
    },
    global: {
      // New-style sb_ keys are opaque strings, not JWTs: send apikey only.
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/** PostgREST or-clauses split on commas, so those characters are stripped. */
function cleanSearch(q: string): string {
  return q.replace(/[,()%*"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

async function hadithIdsForSign(slug: string): Promise<string[]> {
  const supabase = publicClient();
  const { data: sign } = await supabase.from("signs").select("id").eq("slug", slug).maybeSingle();
  if (!sign) return [];
  const { data: links } = await supabase
    .from("sign_hadiths")
    .select("hadith_id")
    .eq("sign_id", sign.id)
    .limit(1000);
  return (links ?? []).map((l) => l.hadith_id);
}

export const listHadiths = createServerFn({ method: "GET" })
  .inputValidator((input: ListInput) => input)
  .handler(async ({ data }): Promise<HadithListResult> => {
    const supabase = publicClient();
    const page = Math.max(1, Math.floor(data.page ?? 1));
    const perPage = 9;

    let query = supabase.from("hadiths").select(LIST_COLS, { count: "exact" });

    const q = cleanSearch(data.q ?? "");
    if (q) {
      query = query.or(
        `tema.ilike.*${q}*,terjemah_id.ilike.*${q}*,terjemah_en.ilike.*${q}*,matan_ringkas_id.ilike.*${q}*,matan_ringkas_en.ilike.*${q}*`,
      );
    }
    if (data.kategori && (KATEGORI as readonly string[]).includes(data.kategori)) {
      query = query.eq("kategori", data.kategori as Database["public"]["Enums"]["tanda_kategori"]);
    }
    if (data.status && (HADITH_STATUS as readonly string[]).includes(data.status)) {
      query = query.eq("status", data.status as Database["public"]["Enums"]["hadith_status"]);
    }
    if (data.kitab) query = query.eq("kitab", data.kitab);

    if (data.sign) {
      const ids = await hadithIdsForSign(data.sign);
      if (ids.length === 0) return { items: [], total: 0, page, perPage, pages: 0 };
      query = query.in("id", ids);
    }

    const { data: rows, error, count } = await query
      .order("code", { ascending: true })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw new Error(error.message);

    const total = count ?? 0;
    return {
      items: (rows ?? []) as HadithListItem[],
      total,
      page,
      perPage,
      pages: Math.ceil(total / perPage),
    };
  });

export const hadithKitabOptions = createServerFn({ method: "GET" }).handler(async (): Promise<string[]> => {
  const supabase = publicClient();
  const { data, error } = await supabase.from("hadiths").select("kitab").limit(1000);
  if (error) throw new Error(error.message);
  const values = new Set<string>();
  for (const row of data ?? []) if (row.kitab) values.add(row.kitab);
  return [...values].sort();
});

export const hadithByCode = createServerFn({ method: "GET" })
  .inputValidator((input: { code: string }) => input)
  .handler(async ({ data }): Promise<HadithDetail | null> => {
    const supabase = publicClient();
    const code = data.code.trim().toUpperCase();
    if (!code) return null;

    const { data: row, error } = await supabase
      .from("hadiths")
      .select(`id, ${DETAIL_COLS}`)
      .eq("code", code)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return null;

    const { data: links } = await supabase
      .from("sign_hadiths")
      .select("sign_id")
      .eq("hadith_id", row.id)
      .limit(1000);

    const signIds = (links ?? []).map((l) => l.sign_id);
    let signs: { slug: string; nama: string }[] = [];
    if (signIds.length > 0) {
      const { data: found } = await supabase
        .from("signs")
        .select("slug, nama")
        .in("id", signIds)
        .order("urutan", { ascending: true });
      signs = found ?? [];
    }

    const { id: _id, ...rest } = row;
    return { ...rest, signs };
  });

export const homeHadithData = createServerFn({ method: "GET" }).handler(async (): Promise<HomeData> => {
  try {
    const supabase = publicClient();

    const [featuredRes, signsRes, linksRes, publishedRes] = await Promise.all([
      supabase.from("hadiths").select(LIST_COLS).order("code", { ascending: true }).limit(1),
      supabase
        .from("signs")
        .select("id, slug, nama, deskripsi_singkat, kategori, status, urutan")
        .order("urutan", { ascending: true })
        .limit(200),
      supabase.from("sign_hadiths").select("sign_id, hadith_id").limit(5000),
      supabase.from("hadiths").select("id").limit(1000),
    ]);

    const featured = (featuredRes.data ?? [])[0] ?? null;
    const published = new Set((publishedRes.data ?? []).map((r) => r.id));

    const counts = new Map<string, number>();
    for (const link of linksRes.data ?? []) {
      if (!published.has(link.hadith_id)) continue;
      counts.set(link.sign_id, (counts.get(link.sign_id) ?? 0) + 1);
    }

    const signs: HomeSign[] = (signsRes.data ?? []).map((s: SignRow) => ({
      slug: s.slug,
      nama: s.nama,
      deskripsi_singkat: s.deskripsi_singkat,
      kategori: s.kategori,
      status: s.status,
      urutan: s.urutan,
      hadithCount: counts.get(s.id) ?? 0,
    }));

    return { featured, signs };
  } catch {
    // Home keeps working with its built-in placeholder map when the
    // database cannot be reached.
    return { featured: null, signs: [] };
  }
});

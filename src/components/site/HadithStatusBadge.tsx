import { cva } from "class-variance-authority";
import { Check, Circle, Minus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type StatusKey =
  | "sudah_terjadi"
  | "sedang_berlangsung"
  | "belum_terjadi"
  | "tidak_berlaku"
  | "unknown";

const badge = cva("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", {
  variants: {
    status: {
      sudah_terjadi: "bg-bone text-ink",
      sedang_berlangsung: "bg-dawn text-ink animate-soft-pulse",
      belum_terjadi: "border border-mist text-mist",
      tidak_berlaku: "border border-border text-muted-foreground",
      unknown: "border border-border text-muted-foreground",
    },
  },
});

const ICONS: Record<StatusKey, typeof Check> = {
  sudah_terjadi: Check,
  sedang_berlangsung: Circle,
  belum_terjadi: Circle,
  tidak_berlaku: Minus,
  unknown: Minus,
};

export function HadithStatusBadge({ status }: { status: string | null }) {
  const { t } = useI18n();
  const key: StatusKey =
    status && status in t.hadith.status ? (status as StatusKey) : "unknown";
  const Icon = ICONS[key];
  return (
    <span className={badge({ status: key })}>
      <Icon className={key === "sudah_terjadi" ? "h-3 w-3" : "h-2 w-2 fill-current"} />
      {t.hadith.status[key]}
    </span>
  );
}

export function DerajatBadge({ derajat }: { derajat: string | null }) {
  if (!derajat) return null;
  return (
    <span className="inline-flex items-center rounded-md border border-dawn/40 px-2 py-0.5 text-[11px] font-medium text-dawn">
      {derajat}
    </span>
  );
}

import { cva } from "class-variance-authority";
import { Check, Circle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { SignStatus } from "@/lib/data";

const badge = cva("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", {
  variants: {
    status: {
      done: "bg-bone text-ink",
      ongoing: "bg-dawn text-ink animate-soft-pulse",
      future: "border border-mist text-mist",
    },
  },
});

export function StatusBadge({ status }: { status: SignStatus }) {
  const { t } = useI18n();
  return (
    <span className={badge({ status })}>
      {status === "done" ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2 fill-current" />}
      {t.status[status]}
    </span>
  );
}

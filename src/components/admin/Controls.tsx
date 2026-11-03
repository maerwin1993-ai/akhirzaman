import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
export function Picker({
  value,
  onChange,
  options,
  label,
  empty = "Semua",
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  label: string;
  empty?: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 max-w-full rounded-md border border-input bg-background px-3 text-sm"
    >
      <option value="">{empty}</option>
      {options.map((v) => (
        <option key={v} value={v}>
          {v.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
export function TextField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <Input required={required} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}
export function adminHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | Admin akhirzaman.id` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | Admin akhirzaman.id` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  };
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Field, Picker, adminHead } from "@/components/admin/Controls";
import { adminReferences, saveSign, deleteSign } from "@/lib/admin.functions";
import { categories } from "@/lib/admin/rules";
import type { Tables } from "@/integrations/supabase/types";
export const Route = createFileRoute("/_authenticated/admin/signs")({
  beforeLoad: ({ context }) => {
    if (context.staff.role !== "admin") throw redirect({ to: "/admin/login" });
  },
  head: () => adminHead("Tanda terkait", "Pengelolaan tanda akhir zaman."),
  component: Signs,
});
const blank = {
  slug: "",
  nama: "",
  deskripsi_singkat: "",
  kategori: null as Tables<"signs">["kategori"],
  status: "belum_terjadi" as Tables<"signs">["status"],
  urutan: 0,
};
function Signs() {
  const refs = useServerFn(adminReferences);
  const save = useServerFn(saveSign);
  const remove = useServerFn(deleteSign);
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin", "references"], queryFn: () => refs() });
  const [edit, setEdit] = useState<Partial<Tables<"signs">> | null>(null);
  const [deleting, setDeleting] = useState<Tables<"signs"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function change(key: string, value: unknown) {
    setEdit((v) => ({ ...v, [key]: value }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    setError("");
    try {
      await save({
        data: {
          id: edit.id,
          fields: {
            slug: edit.slug ?? "",
            nama: edit.nama ?? "",
            deskripsi_singkat: edit.deskripsi_singkat ?? null,
            kategori: edit.kategori ?? null,
            status: edit.status ?? "belum_terjadi",
            urutan: Number(edit.urutan ?? 0),
          },
        },
      });
      await client.invalidateQueries({ queryKey: ["admin"] });
      setEdit(null);
      toast.success("Tanda tersimpan");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  }
  async function del() {
    if (!deleting) return;
    setBusy(true);
    try {
      await remove({ data: { id: deleting.id } });
      setDeleting(null);
      await client.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Tanda dihapus");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-display">Tanda terkait</h1>
        <Button
          onClick={() => {
            setError("");
            setEdit(blank);
          }}
        >
          <Plus />
          Tambah tanda
        </Button>
      </div>
      {query.isError && <p role="alert">Tanda tidak dapat dimuat.</p>}
      {query.isPending && <p>Memuat…</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-border text-muted-foreground">
            <tr>
              {["Urutan", "Nama / Slug", "Kategori", "Status", ""].map((v) => (
                <th key={v} className="p-3 font-normal">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {query.data?.signs.map((sign) => (
              <tr className="border-b border-border" key={sign.id}>
                <td className="p-3">{sign.urutan}</td>
                <td className="p-3">
                  <p>{sign.nama}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{sign.slug}</p>
                </td>
                <td className="p-3">{sign.kategori?.replaceAll("_", " ")}</td>
                <td className="p-3">{sign.status.replaceAll("_", " ")}</td>
                <td className="p-3">
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={`Edit ${sign.nama}`}
                      onClick={() => {
                        setError("");
                        setEdit(sign);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={`Hapus ${sign.nama}`}
                      onClick={() => setDeleting(sign)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={Boolean(edit)}
        onOpenChange={(v) => {
          if (!v && !busy) setEdit(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit?.id ? "Edit tanda" : "Tambah tanda"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Slug">
              <Input
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                value={edit?.slug ?? ""}
                onChange={(e) => change("slug", e.target.value)}
              />
            </Field>
            <Field label="Nama">
              <Input
                required
                value={edit?.nama ?? ""}
                onChange={(e) => change("nama", e.target.value)}
              />
            </Field>
            <Field label="Deskripsi singkat">
              <Textarea
                value={edit?.deskripsi_singkat ?? ""}
                onChange={(e) => change("deskripsi_singkat", e.target.value)}
              />
            </Field>
            <Field label="Kategori">
              <Picker
                label="Kategori tanda"
                empty="Tidak ditetapkan"
                options={categories}
                value={edit?.kategori ?? ""}
                onChange={(v) => change("kategori", v || null)}
              />
            </Field>
            <Field label="Status">
              <select
                aria-label="Status tanda"
                className="h-9 rounded-md border border-input bg-background px-3"
                value={edit?.status ?? "belum_terjadi"}
                onChange={(e) => change("status", e.target.value)}
              >
                {["sudah_terjadi", "sedang_berlangsung", "belum_terjadi"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Urutan">
              <Input
                type="number"
                step="1"
                value={edit?.urutan ?? 0}
                onChange={(e) => change("urutan", Number(e.target.value))}
              />
            </Field>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button disabled={busy} type="submit">
              <Save />
              {busy ? "Menyimpan…" : "Simpan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => {
          if (!v && !busy) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tanda {deleting?.nama}?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua tautan hadits untuk tanda ini juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={busy} onClick={del}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

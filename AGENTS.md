<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Home's photographic background and scroll-motion lifecycle in a dedicated browser-safe component; this isolates its layers and cleanup from other Home sections.
- Staff pages live under the integration-compatible authenticated layout with a nested role gate; the public login remains outside it so anonymous users can sign in.
- Admin reads and writes use authenticated TanStack server functions and RLS; the atomic hadith/sign-link SQL function prevents partially saved edits.
- Parse spreadsheet files in a dedicated browser worker and import bounded batches through authenticated server functions so long Arabic workbooks do not block the interface.
- Root owns the single auth-transition subscriber and switches only admin URLs out of the public shell, preserving public presentation.

# First administrator — akhirzaman.id

1. In Supabase **Authentication → Users → Add user**, create your email/password user and mark the email confirmed. Copy its User UID.
2. In the SQL editor, replace `YOUR_USER_UUID` and run:

```sql
insert into public.user_roles (user_id, role)
values ('YOUR_USER_UUID'::uuid, 'admin'::public.app_role)
on conflict (user_id, role) do nothing;
```

3. **Authentication → Sign In / Providers → Email**: enable the Email provider (email/password).
4. After creating your administrator, **Authentication → Sign In / Providers → User Signups**: turn off **Allow new users to sign up**. Keep Email enabled. If your dashboard places this switch under Email settings, disable **Allow new users to sign up** there. Create future staff through the dashboard, then assign `admin` or `reviewer` in `public.user_roles`.
5. Sign in at `/admin/login`. There is no signup or password-reset interface. Set a forgotten staff password through the Supabase dashboard.
6. **Authentication → Rate Limits**: review the rate limits available to your Supabase plan. Sign-in uses Supabase Auth's enforced limits and displays a retry message for HTTP 429. No custom shared login limiter was added; this platform has no standard app rate-limit primitive. Hosted settings were not changed or verified by this implementation.

## Import

- CSV must be UTF-8. XLSX defaults to the `Data Hadis` sheet, with other sheets selectable.
- `id` maps to code; `grup` is ignored; `pilih`, `catatan_ustadz`, and all mapped hadith content are retained.
- Default selection is `pilih=Ya`; the import-all switch overrides it.
- Duplicate decisions are per normalized code. Skip preserves existing data and skips subsequent occurrences. Update processes rows in file order, so the last valid occurrence wins. Updated rows become unpublished too.
- Invalid rows are excluded and included in the downloadable error report. Imports run in small batches with per-row outcomes, not as a whole-file transaction. A network interruption can leave some rows saved; inspect the collection before retrying. Skip defaults prevent accidentally overwriting prior inserts.
- Reviewers can edit and publish hadiths and manage related links; only admins can import, delete hadiths, or manage signs.

## Verification status

Rule tests, unauthenticated route redirects, rejected sign-in, public-page regression, and spreadsheet text parsing were checked. Authenticated editing/import/read-back could not be checked against this external Supabase project's accounts. Create the first administrator above, then test those flows with your actual data before publishing.
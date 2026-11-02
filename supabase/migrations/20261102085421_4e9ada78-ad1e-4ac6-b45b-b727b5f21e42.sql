-- ============================================================
-- Fix linter findings on public.has_role
-- 0028 anon can execute a SECURITY DEFINER function
-- 0029 authenticated can execute a SECURITY DEFINER function
-- ============================================================

-- 1. Only signed-in users (and the service account) may call it.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

-- 2. Run as the caller, so it can only ever read the caller's own role rows
--    (already restricted by user_roles' "members read their own role" policy).
--    This removes the privilege-escalation surface SECURITY DEFINER creates.
alter function public.has_role(uuid, public.app_role) security invoker;
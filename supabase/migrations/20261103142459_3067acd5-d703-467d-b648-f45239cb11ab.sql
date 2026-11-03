ALTER TABLE public.hadiths ADD COLUMN IF NOT EXISTS catatan_ustadz text, ADD COLUMN IF NOT EXISTS pilih text;
DROP POLICY IF EXISTS "hadiths: staff deletes" ON public.hadiths;
CREATE POLICY "hadiths: admin deletes" ON public.hadiths FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "hadiths: staff inserts" ON public.hadiths;
CREATE POLICY "hadiths: admin inserts" ON public.hadiths FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "signs: staff deletes" ON public.signs;
DROP POLICY IF EXISTS "signs: staff inserts" ON public.signs;
DROP POLICY IF EXISTS "signs: staff updates" ON public.signs;
CREATE POLICY "signs: admin deletes" ON public.signs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "signs: admin inserts" ON public.signs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "signs: admin updates" ON public.signs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE OR REPLACE FUNCTION public.validate_hadith_publication() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN
 IF NEW.is_published THEN
  IF NULLIF(btrim(NEW.verified_by), '') IS NULL THEN RAISE EXCEPTION 'Publishing requires verified_by'; END IF;
  IF TG_OP = 'INSERT' THEN NEW.verified_at = now();
  ELSIF NOT OLD.is_published OR NEW.verified_by IS DISTINCT FROM OLD.verified_by THEN NEW.verified_at = now();
  ELSE NEW.verified_at = OLD.verified_at; END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER hadith_publication_validation BEFORE INSERT OR UPDATE ON public.hadiths FOR EACH ROW EXECUTE FUNCTION public.validate_hadith_publication();
CREATE OR REPLACE FUNCTION public.save_hadith_with_signs(p_id uuid, p_fields jsonb, p_sign_ids uuid[]) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE saved_id uuid; v public.hadiths;
BEGIN
 IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'reviewer')) THEN RAISE EXCEPTION 'Forbidden'; END IF;
 IF p_id IS NULL THEN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  v := jsonb_populate_record(null::public.hadiths, p_fields);
  INSERT INTO public.hadiths (code, kitab, nomor, bab, jenis, derajat, penilai_derajat, teks_arab, terjemah_id, terjemah_en, matan_ringkas_id, matan_ringkas_en, syarah_ringkas, rujukan_syarah, link_sumber, kategori, status, tema, is_published, verified_by, catatan_ustadz, pilih)
  VALUES (v.code,v.kitab,v.nomor,v.bab,v.jenis,v.derajat,v.penilai_derajat,v.teks_arab,v.terjemah_id,v.terjemah_en,v.matan_ringkas_id,v.matan_ringkas_en,v.syarah_ringkas,v.rujukan_syarah,v.link_sumber,v.kategori,v.status,v.tema,coalesce(v.is_published,false),v.verified_by,v.catatan_ustadz,v.pilih) RETURNING id INTO saved_id;
 ELSE
  SELECT * INTO v FROM public.hadiths WHERE id=p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Hadith not found'; END IF;
  v := jsonb_populate_record(v, p_fields);
  UPDATE public.hadiths SET code=v.code,kitab=v.kitab,nomor=v.nomor,bab=v.bab,jenis=v.jenis,derajat=v.derajat,penilai_derajat=v.penilai_derajat,teks_arab=v.teks_arab,terjemah_id=v.terjemah_id,terjemah_en=v.terjemah_en,matan_ringkas_id=v.matan_ringkas_id,matan_ringkas_en=v.matan_ringkas_en,syarah_ringkas=v.syarah_ringkas,rujukan_syarah=v.rujukan_syarah,link_sumber=v.link_sumber,kategori=v.kategori,status=v.status,tema=v.tema,is_published=coalesce(v.is_published,false),verified_by=v.verified_by,catatan_ustadz=v.catatan_ustadz,pilih=v.pilih WHERE id=p_id RETURNING id INTO saved_id;
 END IF;
 DELETE FROM public.sign_hadiths WHERE hadith_id=saved_id;
 INSERT INTO public.sign_hadiths (hadith_id,sign_id) SELECT saved_id, unnest(p_sign_ids) ON CONFLICT DO NOTHING;
 RETURN saved_id;
END; $$;
REVOKE ALL ON FUNCTION public.save_hadith_with_signs(uuid,jsonb,uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_hadith_with_signs(uuid,jsonb,uuid[]) TO authenticated;
REVOKE ALL ON FUNCTION public.validate_hadith_publication() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.validate_hadith_publication() TO authenticated, service_role;
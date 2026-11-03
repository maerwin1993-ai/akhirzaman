import { z } from 'zod';
export const categories = ['tanda_kecil','tanda_besar','fitnah','akhirat','umum'] as const;
export const statuses = ['sudah_terjadi','sedang_berlangsung','belum_terjadi','tidak_berlaku'] as const;
export const textFields = ['code','tema','kitab','nomor','bab','jenis','derajat','penilai_derajat','teks_arab','terjemah_id','terjemah_en','matan_ringkas_id','matan_ringkas_en','syarah_ringkas','rujukan_syarah','link_sumber','verified_by','catatan_ustadz','pilih'] as const;
export const labels: Record<string,string> = {code:'Kode',tema:'Tema',kitab:'Kitab',nomor:'Nomor',bab:'Bab',jenis:'Jenis',derajat:'Derajat',penilai_derajat:'Penilai derajat',teks_arab:'Teks Arab',terjemah_id:'Terjemah Indonesia',terjemah_en:'Terjemah Inggris',matan_ringkas_id:'Matan ringkas Indonesia',matan_ringkas_en:'Matan ringkas Inggris',syarah_ringkas:'Syarah ringkas',rujukan_syarah:'Rujukan syarah',link_sumber:'Link sumber',verified_by:'Diverifikasi oleh',catatan_ustadz:'Catatan ustadz',pilih:'Pilih',kategori:'Kategori',status:'Status'};
const text = z.string().trim().max(100000).nullable().optional();
const textShape = Object.fromEntries(textFields.map(f=>[f,text])) as Record<typeof textFields[number], typeof text>;
export const hadithSchema = z.object(textShape).extend({code:z.string().trim().min(1).max(150).transform(v=>v.toUpperCase()), kitab:z.string().trim().min(1),nomor:z.string().trim().min(1),teks_arab:z.string().trim().min(1).max(100000),kategori:z.enum(categories).nullable(),status:z.enum(statuses).nullable(),is_published:z.boolean(),verified_by:text}).superRefine((v,ctx)=>{if(v.is_published && !v.verified_by?.trim())ctx.addIssue({code:'custom',path:['verified_by'],message:'Isi nama verifikator sebelum menerbitkan.'});if(v['link_sumber']){try{const url=new URL(String(v['link_sumber']));if(!['https:','http:'].includes(url.protocol))throw Error();}catch{ctx.addIssue({code:'custom',path:['link_sumber'],message:'Link sumber harus URL http/https.'});}}});
export type HadithFields = z.infer<typeof hadithSchema>;
export function canManage(role:string){return role==='admin';}
export function normalizeHeader(v:string){return v.trim().toLowerCase().replace(/[\s-]+/g,'_');}
export function detectMapping(headers:string[]){const aliases:Record<string,string>={id:'code',link_sunnah:'link_sumber',diverifikasi_oleh:'verified_by'};return Object.fromEntries(headers.map(h=>{const n=normalizeHeader(h);return [h,aliases[n]??([...textFields,'kategori','status'].includes(n)?n:'')];}));}
export function mapEnum(value:string,values:readonly string[]){const normalized=normalizeHeader(value);return !normalized?null:values.includes(normalized)?normalized:undefined;}
export type ImportRow={row:number;fields:Record<string,unknown>;errors:string[];duplicate:boolean;code:string};
export function prepareImport(rows:Record<string,string>[],mapping:Record<string,string>,all:boolean,existing:string[]):ImportRow[]{
 const seen=new Set<string>();const known=new Set(existing.map(v=>v.toUpperCase()));const output:ImportRow[]=[];
 rows.forEach((row,index)=>{const fields:Record<string,unknown>={is_published:false};for(const [header,target] of Object.entries(mapping))if(target)fields[target]=(row[header]??'').trim();if(!all && String(fields['pilih']??'').toLowerCase()!=='ya')return;
 const errors:string[]=[];for(const f of ['code','kitab','nomor','teks_arab'])if(!fields[f])errors.push(`${labels[f]} wajib diisi`);
 const code=String(fields['code']??'').toUpperCase();fields['code']=code;
 for(const [field,values] of [['kategori',categories],['status',statuses]] as const){const v=mapEnum(String(fields[field]??''),values);if(v===undefined)errors.push(`${labels[field]} tidak dikenal`);fields[field]=v??null;}
 const parsed=hadithSchema.safeParse(fields);if(!parsed.success)for(const issue of parsed.error.issues){const message=issue.message;if(!errors.includes(message) && !(issue.code==='too_small' && ['code','kitab','nomor','teks_arab'].includes(String(issue.path[0]))))errors.push(message);}
 const duplicate=seen.has(code)||known.has(code);seen.add(code);output.push({row:index+2,fields,errors,duplicate,code});});return output;
}
export function draftFields(fields:Record<string,unknown>){return {...fields,is_published:false};}

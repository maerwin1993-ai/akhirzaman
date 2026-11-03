import { createFileRoute,redirect } from '@tanstack/react-router';
import { adminHead } from '@/components/admin/Controls';
export const Route=createFileRoute('/_authenticated/admin/')({beforeLoad:()=>{throw redirect({to:'/admin/hadits'});},head:()=>adminHead('Admin','Pengelolaan konten akhirzaman.id.')});

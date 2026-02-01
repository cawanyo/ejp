import { getMemberAndClosestFamilies } from '@/app/actions/family';
import { redirect } from 'next/navigation';
import { AssignClient } from './assign-client';

export default async function AssignPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // Type is now a Promise
}) {
  const { id } = await params;

  const { member, closestFamilies } = await getMemberAndClosestFamilies(id);

  if (!member) {
    redirect('/members');
  }

  return <AssignClient member={member} families={closestFamilies} />;
}
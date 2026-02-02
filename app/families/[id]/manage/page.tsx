import { getFamilyWithDetails } from '@/app/actions/family';

import { notFound } from 'next/navigation';
import { FamilyManageClient } from './FamilyManage';

export default async function FamilyManagePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const data = await getFamilyWithDetails(id);

  if (!data) {
    return notFound();
  }

  return (
    <FamilyManageClient
      initialFamily={data.family} 
      initialAvailable={data.availableMembers} 
    />
  );
}
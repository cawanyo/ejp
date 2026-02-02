import { getMemberForFollowUp } from '@/app/actions/follow-up';

import { notFound } from 'next/navigation';
import { FollowUpClient } from './FollowUp';

export default async function FollowUpPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const member = await getMemberForFollowUp(id);

  if (!member) {
    return notFound();
  }

  return <FollowUpClient member={member} />;
}
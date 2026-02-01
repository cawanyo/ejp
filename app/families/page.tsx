import { getFamilies, getUsers, getAvailableMembers } from '@/app/actions/family';
import { FamiliesClient } from './families-client';


export default async function FamiliesPage() {
  const [families, users, availableMembers] = await Promise.all([
    getFamilies(),
    getUsers(),
    getAvailableMembers()
  ]);

  return (
    <FamiliesClient 
      initialFamilies={families} 
      initialUsers={users}
      availableMembers={availableMembers}
    />
  );
}
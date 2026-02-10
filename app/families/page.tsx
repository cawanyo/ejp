import { getPaginatedFamilies, getUsers, getAvailableMembers, getPaginatedUsers } from '@/app/actions/family';
import { FamiliesClient } from './families-client';

export default async function FamiliesPage() {
  // Await params in Next.js 15
  const page = 1;
  const query = '';

  // Fetch paginated data
  const [paginatedData, userData, availableMembers] = await Promise.all([
    getPaginatedFamilies({ page, query }),
    getPaginatedUsers({ page: 1, query: '' }),
    getAvailableMembers()
  ]);

  return (
    <FamiliesClient 
      initialFamilies={paginatedData.families} 
      metadata={paginatedData.metadata} // Pass metadata for pagination
      initialUsers={userData.users}
      userMetadata={userData.metadata}
      availableMembers={availableMembers}
    />
  );
}
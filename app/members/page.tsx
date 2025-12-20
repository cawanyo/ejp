import { MembersClient } from "@/components/MemberClient";
import { getPaginatedMembers } from "../actions/member";


export default async function MembersPage() {
  // Parse Query Params
  const { members, metadata } = await getPaginatedMembers({ 
    page: 1, 
    pageSize: 10 
  });

  // Fetch Data


  return (
    <MembersClient
      initialMembers={members} 
      initialMetadata={metadata}
    />
  );
}
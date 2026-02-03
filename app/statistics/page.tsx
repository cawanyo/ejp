import { StatisticsClient } from "@/components/StatClient";
import { getMembers } from "../actions/member";
import { getFamilies } from "../actions/family";
export const dynamic = 'force-dynamic';

export default async function StatisticsPage() {
  const members = await getMembers();
  const families = await getFamilies()
  return <StatisticsClient initialMembers={members} families={families}/>;
}
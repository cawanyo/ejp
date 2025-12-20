import { StatisticsClient } from "@/components/StatClient";
import { getMembers } from "../actions/member";


export default async function StatisticsPage() {
  const members = await getMembers();
  return <StatisticsClient initialMembers={members} />;
}
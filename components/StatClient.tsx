'use client'

import { useMemo } from 'react';
import { StatCard } from '@/components/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Calendar, UserPlus, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { isThisMonth, isThisWeek, isThisYear, parseISO } from 'date-fns';
import { Member } from '@/lib/types';
import { MonthlyTrends } from './MonthlyTrend';
import { DemographicsView } from './DemographicView';
import { WeeklyTrends } from './WeeklyTrend';

// Components


const COLORS = {
  indigo: '#6366f1',
  purple: '#a855f7',
  pink: '#ec4899',
  amber: '#f59e0b',
  teal: '#14b8a6',
};

const PIE_COLORS = [COLORS.indigo, COLORS.purple, COLORS.pink, COLORS.amber, COLORS.teal];

export function StatisticsClient({ initialMembers }: { initialMembers: Member[] }) {
  const members = initialMembers;

  // General Stats (Total/Month/Week/Year) - Keep these always current relative to "Now"
  const stats = useMemo(() => {
    return {
      total: members.length,
      thisMonth: members.filter((m) => isThisMonth(parseISO(m.registrationDate))).length,
      thisWeek: members.filter((m) => isThisWeek(parseISO(m.registrationDate))).length,
      thisYear: members.filter((m) => isThisYear(parseISO(m.registrationDate))).length,
    };
  }, [members]);

  return (
    <div className="w-full relative min-h-screen pb-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-20 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Insights into your youth ministry growth</p>
          </div>
        </div>
      </div>

      {/* Overview Cards (Top Level Summary) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats.total}
          icon={<Users className="h-6 w-6" />}
          color="indigo"
          description="Total active database"
        />
        <StatCard
          title="This Month"
          value={stats.thisMonth}
          icon={<Calendar className="h-6 w-6" />}
          color="purple"
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatCard
          title="This Week"
          value={stats.thisWeek}
          icon={<TrendingUp className="h-6 w-6" />}
          color="pink"
          description="New registrations"
        />
        <StatCard
          title="This Year"
          value={stats.thisYear}
          icon={<UserPlus className="h-6 w-6" />}
          color="amber"
          description="Year to date"
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="trends" className="space-y-6 ">
        <div className=" w-full flex items-center justify-between">
          <TabsList className="bg-white/40 dark:bg-black/20 border border-white/10 backdrop-blur-xl p-1 h-auto rounded-xl flex  flex-col sm:flex-row w-full">
            <TabsTrigger value="trends" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Growth Trends
            </TabsTrigger>
            <TabsTrigger value="week" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Week Trends
            </TabsTrigger>
            <TabsTrigger value="demographics" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm w-full">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Demographics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Monthly Trends (With Year Filter) */}
        <TabsContent value="trends" className="space-y-6">
          <MonthlyTrends members={members} colors={COLORS} />
        </TabsContent>

        {/* Tab 2: Demographics (With Year/Month/Day Filters) */}
        <TabsContent value="demographics" className="space-y-6">
          <DemographicsView members={members} colors={COLORS} pieColors={PIE_COLORS} />
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <WeeklyTrends members={members} colors={COLORS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
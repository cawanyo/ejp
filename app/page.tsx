import Link from 'next/link';
import { Users, UserPlus, TrendingUp, Calendar, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, isThisMonth, isThisWeek, isThisYear, parseISO } from 'date-fns';
import { getMembers } from './actions/member';

export default async function Dashboard() {
  const members = await getMembers();

  const stats = {
    total: members.length,
    thisMonth: members.filter(m => isThisMonth(parseISO(m.registrationDate))).length,
    thisWeek: members.filter(m => isThisWeek(parseISO(m.registrationDate))).length,
    thisYear: members.filter(m => isThisYear(parseISO(m.registrationDate))).length,
  };

  const recentMembers = members.slice(0, 5);

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500 ">
      
      {/* 1. Ambient Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* 2. Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Back</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Manage your youth ministry, track growth, and connect with members.
          </p>
        </div>
        <div className="flex gap-3">
           <Link href="/register">
            <Button size="lg" className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 border-0">
              <UserPlus className="mr-2 h-5 w-5" /> 
              New Member
            </Button>
           </Link>
        </div>
      </div>

      {/* 3. Statistics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats.total}
          icon={<Users className="h-6 w-6" />}
          description="Active youth members"
          color="indigo" 
        />
        <StatCard
          title="New This Month"
          value={stats.thisMonth}
          icon={<Calendar className="h-6 w-6" />}
          trend={{ value: 12, label: 'vs last month' }} // You can make this dynamic later
          color="purple"
        />
        <StatCard
          title="New This Week"
          value={stats.thisWeek}
          icon={<TrendingUp className="h-6 w-6" />}
          color="pink"
        />
        <StatCard
          title="New This Year"
          value={stats.thisYear}
          icon={<Sparkles className="h-6 w-6" />}
          color="amber"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* 4. Recent Registrations List */}
        <Card className="md:col-span-4 border-white/10 shadow-xl bg-white/40 dark:bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Recent Registrations</CardTitle>
              <CardDescription>Latest members to join the family</CardDescription>
            </div>
            <Link href="/members">
              <Button variant="ghost" size="sm" className="gap-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              {recentMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Activity className="h-10 w-10 mb-2 opacity-20" />
                  <p>No registrations yet.</p>
                </div>
              ) : (
                recentMembers.map((member, i) => (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar with dynamic colors */}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-transform group-hover:scale-110 ${
                        i % 2 === 0 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                      }`}>
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-2.5 py-1 rounded-full bg-secondary/80 text-[10px] font-medium uppercase tracking-wide">
                        {format(parseISO(member.registrationDate), 'MMM d')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* 5. Quick Actions Panel */}
        <Card className="md:col-span-3 border-none shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
          {/* Decorative circles inside the card */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-black/10 blur-xl" />
          
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-200" /> 
              Quick Actions
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Jump to common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
             <Link href="/register" className="block">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-[1.02] transition-all cursor-pointer border border-white/10 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-inner">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Register Member</p>
                  <p className="text-xs text-indigo-100 opacity-80">Add a new profile</p>
                </div>
              </div>
             </Link>
             
             <Link href="/statistics" className="block">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-[1.02] transition-all cursor-pointer border border-white/10 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-inner">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">View Analytics</p>
                  <p className="text-xs text-indigo-100 opacity-80">Check growth trends</p>
                </div>
              </div>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
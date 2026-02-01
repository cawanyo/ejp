'use client'

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachWeekOfInterval, getYear, isSameWeek } from 'date-fns';
import { Member } from '@/lib/types';

interface WeeklyTrendsProps {
  members: Member[];
  colors: { purple: string };
}

export function WeeklyTrends({ members, colors }: WeeklyTrendsProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth().toString(); // 0-indexed

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 1. Get Available Years
  const years = useMemo(() => {
    const uniqueYears = new Set(members.map(m => getYear(parseISO(m.registrationDate))));
    uniqueYears.add(currentYear);
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [members, currentYear]);

  // 2. Calculate Weekly Data for Selected Month/Year
  const chartData = useMemo(() => {
    // Create date object for the 1st of selected month/year
    const monthStart = new Date(parseInt(selectedYear), parseInt(selectedMonth), 1);
    const monthEnd = endOfMonth(monthStart);

    // Generate weeks within that month
    // Note: eachWeekOfInterval might return a week starting in prev month if using Sunday start
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });

    return weeks.map((weekStart, index) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const count = members.filter((m) => {
        const regDate = parseISO(m.registrationDate);
        // Check if registration date falls within this week window
        // AND ensuring we only count stats relevant to the selected month 
        // (though standard weekly views usually just show the calendar week)
        return isSameWeek(regDate, weekStart);
      }).length;

      return {
        name: `Week ${index + 1}`,
        range: `${format(weekStart, 'd MMM')} - ${format(weekEnd, 'd MMM')}`,
        count,
      };
    });
  }, [members, selectedYear, selectedMonth]);

  const monthName = format(new Date(parseInt(selectedYear), parseInt(selectedMonth), 1), 'MMMM');

  return (
    <Card className="border-white/10 shadow-xl bg-white/40 dark:bg-black/20 backdrop-blur-xl">
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-8">
        <div className="space-y-1">
          <CardTitle>Croissance Hebdomadaire</CardTitle>
          <CardDescription>
            Breakdown for <span className="font-semibold text-foreground">{monthName} {selectedYear}</span>
          </CardDescription>
        </div>
        
        <div className="flex gap-2">
          {/* Month Select */}
          <div className="w-[110px]">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/10">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2024, i, 1), 'MMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Select */}
          <div className="w-[90px]">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/10">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted-foreground/10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="currentColor" 
                className="text-muted-foreground text-xs" 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="currentColor" 
                className="text-muted-foreground text-xs" 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 shadow-xl text-sm">
                        <p className="font-semibold mb-1">{payload[0].payload.range}</p>
                        <p className="text-purple-600 dark:text-purple-400">
                          Registrations: <span className="font-bold">{payload[0].value}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill={colors.purple}
                radius={[6, 6, 0, 0]}
                barSize={40}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
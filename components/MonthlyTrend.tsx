'use client'

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfYear, endOfYear, eachMonthOfInterval, getYear } from 'date-fns';
import { Member } from '@/lib/types';

interface MonthlyTrendsProps {
  members: Member[];
  colors: { indigo: string };
}

export function MonthlyTrends({ members, colors }: MonthlyTrendsProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // 1. Extract available years from data
  const years = useMemo(() => {
    const uniqueYears = new Set(members.map(m => getYear(parseISO(m.registrationDate))));
    // Ensure current year is always available
    uniqueYears.add(currentYear); 
    return Array.from(uniqueYears).sort((a, b) => b - a); // Descending
  }, [members, currentYear]);

  // 2. Calculate Data for Selected Year (Jan - Dec)
  const chartData = useMemo(() => {
    const yearStart = startOfYear(new Date(parseInt(selectedYear), 0, 1));
    const yearEnd = endOfYear(new Date(parseInt(selectedYear), 0, 1));
    
    // Generate all 12 months for the selected year
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return months.map((month) => {
      const monthStr = format(month, 'yyyy-MM');
      const count = members.filter((m) => {
        // Match strictly by YYYY-MM
        return m.registrationDate.startsWith(monthStr); 
      }).length;

      return {
        month: format(month, 'MMM'), // "Jan", "Feb"
        fullMonth: format(month, 'MMMM yyyy'),
        count,
      };
    });
  }, [members, selectedYear]);

  return (
    <Card className="border-white/10 shadow-xl bg-white/40 dark:bg-black/20 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle>Monthly Registrations</CardTitle>
          <CardDescription>
            Performance for <span className="font-semibold text-foreground">{selectedYear}</span>
          </CardDescription>
        </div>
        <div className="w-[120px]">
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
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.indigo} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.indigo} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted-foreground/10" vertical={false} />
              <XAxis 
                dataKey="month" 
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
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: colors.indigo, fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={colors.indigo}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCount)"
                name="Registrations"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
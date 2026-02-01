'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, differenceInYears, isSameDay, isSameMonth, isSameYear, getYear } from 'date-fns';
import { Member } from '@/lib/types';
import { Filter } from 'lucide-react';

interface DemographicsViewProps {
  members: Member[];
  colors: any;
  pieColors: string[];
}

type FilterType = 'year' | 'month' | 'day';

export function DemographicsView({ members, colors, pieColors }: DemographicsViewProps) {
  const currentYear = new Date().getFullYear();
  
  // -- Filter States --
  const [filterType, setFilterType] = useState<FilterType>('year');
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // 1. Get Available Years for Dropdown
  const years = useMemo(() => {
    const uniqueYears = new Set(members.map(m => getYear(parseISO(m.registrationDate))));
    uniqueYears.add(currentYear);
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [members, currentYear]);

  // 2. Filter Logic
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const regDate = parseISO(m.registrationDate);

      if (filterType === 'year') {
        return isSameYear(regDate, new Date(parseInt(selectedYear), 0, 1));
      } 
      if (filterType === 'month') {
        return isSameMonth(regDate, parseISO(selectedMonth));
      } 
      if (filterType === 'day') {
        return isSameDay(regDate, parseISO(selectedDay));
      }
      return true;
    });
  }, [members, filterType, selectedYear, selectedMonth, selectedDay]);

  // 3. Calc Gender Data
  const genderData = useMemo(() => {
    const counts = filteredMembers.reduce((acc, m) => {
      acc[m.gender] = (acc[m.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Handle empty state
    if (filteredMembers.length === 0) return [{ name: 'No Data', value: 1 }];

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [filteredMembers]);

  // 4. Calc Age Data
  const ageDistribution = useMemo(() => {
    if (filteredMembers.length === 0) return [];
    
    const now = new Date();
    const ranges = [
      { range: '10-12', min: 10, max: 12 },
      { range: '13-15', min: 13, max: 15 },
      { range: '16-18', min: 16, max: 18 },
      { range: '19-21', min: 19, max: 21 },
      { range: '22+', min: 22, max: 100 },
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: filteredMembers.filter((m) => {
        const age = differenceInYears(now, parseISO(m.dateOfBirth));
        return age >= min && age <= max;
      }).length
    }));
  }, [filteredMembers]);

  const isEmpty = filteredMembers.length === 0;

  return (
    <div className="space-y-6">
      
      {/* Filter Bar */}
      <Card className="border-white/10 shadow-sm bg-white/40 dark:bg-black/20 backdrop-blur-xl">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-muted-foreground mr-auto">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtrer par:</span>
          </div>

          {/* Type Selector */}
          <Select value={filterType} onValueChange={(val: FilterType) => setFilterType(val)}>
            <SelectTrigger className="w-full sm:w-[150px] bg-white/50 dark:bg-black/20 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Année</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="day">Jour</SelectItem>
            </SelectContent>
          </Select>

          {/* Dynamic Input based on Type */}
          <div className="w-full sm:w-[200px]">
            {filterType === 'year' && (
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/10">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            )}

            {filterType === 'month' && (
              <Input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white/50 dark:bg-black/20 border-white/10"
              />
            )}

            {filterType === 'day' && (
              <Input 
                type="date" 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-white/50 dark:bg-black/20 border-white/10"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Showing data for <span className="font-bold text-foreground">{filteredMembers.length}</span> members based on selection.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gender Chart */}
        <Card className="border-white/10 shadow-xl bg-white/40 dark:bg-black/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Distribution de genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {isEmpty ? (
                <p className="text-muted-foreground">No data found for this period.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Age Chart */}
        <Card className="border-white/10 shadow-xl bg-white/40 dark:bg-black/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Group d'age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {isEmpty ? (
                 <p className="text-muted-foreground">No data found for this period.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistribution} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted-foreground/10" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="range"
                      type="category"
                      stroke="currentColor"
                      className="text-muted-foreground text-xs font-medium"
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar
                      dataKey="count"
                      fill={colors.pink}
                      radius={[0, 6, 6, 0]}
                      barSize={24}
                      label={{ position: 'right', fill: 'currentColor', fontSize: 12 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
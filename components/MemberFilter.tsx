'use client'

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, CalendarIcon, X } from 'lucide-react';

interface MembersFilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onClearFilters: () => void;
}

export function MembersFilter({
  searchQuery,
  setSearchQuery,
  gender,
  setGender,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClearFilters,
}: MembersFilterProps) {
  const hasActiveFilters = searchQuery || gender !== 'all' || startDate || endDate;

  return (
    <Card className="border-white/10 shadow-lg bg-white/40 dark:bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
      <CardContent className="p-4 gap-4 flex flex-wrap">
        {/* Top Row: Search & Gender */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-black/20 border-white/10"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/10">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Gender" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="male">Homme</SelectItem>
                <SelectItem value="female">Femme</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom Row: Date Range & Clear */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 w-full md:w-auto">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Filtrer par date d'ajout
            </Label>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 md:w-[180px]">
                <CalendarIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground z-10" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9 bg-white/50 dark:bg-black/20 border-white/10 h-9 text-sm"
                />
              </div>
              <span className="text-muted-foreground text-sm font-medium">to</span>
              <div className="relative flex-1 md:w-[180px]">
                <CalendarIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground z-10" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9 bg-white/50 dark:bg-black/20 border-white/10 h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters} 
              className="gap-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 ml-auto md:ml-0 mb-0.5"
            >
              <X className="h-4 w-4" />
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
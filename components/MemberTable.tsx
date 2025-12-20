'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Member } from '@/lib/types';

interface MembersTableProps {
  members: Member[];
  onViewMember: (member: Member) => void;
  isPending: boolean;
}

export function MembersTable({ members, onViewMember, isPending }: MembersTableProps) {
  return (
    <Card className="border-white/10 shadow-xl bg-white/40 dark:bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 overflow-hidden min-h-[400px]">
      <CardContent className="p-0">
        <div className="relative">
          {/* Loading Overlay */}
          {isPending && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          )}

          <Table>
            <TableHeader className="bg-white/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-[40%] md:w-[30%]">Member Info</TableHead>
                <TableHead className="hidden md:table-cell w-[25%]">Contact</TableHead>
                <TableHead className="hidden md:table-cell w-[15%]">Gender</TableHead>
                <TableHead className="hidden md:table-cell w-[15%]">Registered</TableHead>
                <TableHead className="w-[15%] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <User className="h-12 w-12 opacity-20" />
                      <p>No members found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} className="group hover:bg-white/40 dark:hover:bg-white/5 border-white/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{member.firstName} {member.lastName}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{member.phone}</p>
                          {member.parentName && (
                            <p className="hidden md:block text-xs text-muted-foreground">
                              Parent: {member.parentName}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-0.5">
                        <p className="text-sm text-foreground/90">{member.email}</p>
                        <p className="text-xs text-muted-foreground font-mono">{member.phone}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      <Badge 
                        variant="secondary" 
                        className={`capitalize ${
                          member.gender === 'male' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                          member.gender === 'female' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30' :
                          'bg-gray-100'
                        }`}
                      >
                        {member.gender}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(parseISO(member.registrationDate), 'MMM d, yyyy')}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewMember(member)}
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
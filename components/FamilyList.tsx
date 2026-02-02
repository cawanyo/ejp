'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, User, Users, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Family, User as UserType, Member } from '@/lib/types';

import { deleteFamily } from '@/app/actions/family';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { FamilySheet } from './FamilySheet';
import { FamilyMembersSheet } from './FamilyMemberSheet';
import Link from 'next/link';

interface FamilyListProps {
  families: Family[];
  users: UserType[];
  availableMembers: Member[];
}

export function FamilyList({ families, users, availableMembers }: FamilyListProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  const handleEdit = (family: Family) => {
    setSelectedFamily(family);
    setIsSheetOpen(true);
  };

  const handleManageMembers = (family: Family) => {
    setSelectedFamily(family);
    setIsMembersSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedFamily(null);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will unassign all members from this family.')) {
       const res = await deleteFamily(id);
       if (res.success) toast.success("Family deleted");
       else toast.error("Error deleting family");
    }
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Create Card */}
        <button 
          onClick={handleCreate}
          className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-muted-foreground/25 bg-white/20 dark:bg-black/10 hover:bg-white/40 dark:hover:bg-black/20 transition-all h-[280px]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
            <Plus className="h-8 w-8" />
          </div>
          <p className="font-semibold text-lg text-muted-foreground group-hover:text-foreground">Create New Family</p>
        </button>

        {/* Family Cards */}
        {families.map((family) => (
          <Card key={family.id} className="border-white/10 shadow-lg bg-white/40 dark:bg-black/20 backdrop-blur-xl flex flex-col h-[280px]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{family.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {family.address}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(family)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(family.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               {/* Leaders */}
               <div className="space-y-2">
                 <div className="flex items-center gap-2 p-2 rounded-lg bg-white/30 dark:bg-white/5 border border-white/5">
                   <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Pilote</Badge>
                   {family.pilote ? (
                     <span className="text-sm font-medium">{family.pilote.firstName} {family.pilote.lastName}</span>
                   ) : (
                     <span className="text-sm text-muted-foreground italic">Not assigned</span>
                   )}
                 </div>
                 <div className="flex items-center gap-2 p-2 rounded-lg bg-white/30 dark:bg-white/5 border border-white/5">
                   <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Copilote</Badge>
                   {family.copilote ? (
                     <span className="text-sm font-medium">{family.copilote.firstName} {family.copilote.lastName}</span>
                   ) : (
                     <span className="text-sm text-muted-foreground italic">Not assigned</span>
                   )}
                 </div>
               </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-white/10">
              <Link href={`/families/${family.id}/manage`} className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between hover:bg-white/20 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{family.members.length} Members</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Manage members →</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <FamilySheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        family={selectedFamily}
        users={users}
      />
      
      {selectedFamily && (
        <FamilyMembersSheet
          open={isMembersSheetOpen}
          onOpenChange={setIsMembersSheetOpen}
          family={selectedFamily}
          availableMembers={availableMembers}
        />
      )}
    </>
  );
}
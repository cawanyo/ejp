'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Family, Member } from '@/lib/types';
import { addMemberToFamily, removeMemberFromFamily } from '@/app/actions/family';

import { useState } from 'react';
import { toast } from 'sonner';

interface FamilyMembersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  family: Family;
  availableMembers: Member[];
}

export function FamilyMembersSheet({ open, onOpenChange, family, availableMembers }: FamilyMembersSheetProps) {

  const [search, setSearch] = useState('');

  const handleAdd = async (memberId: string) => {
    const res = await addMemberToFamily(family.id, memberId);
    if (res.success) toast.success("Member added");
    else toast.error("Failed to add member");
  };

  const handleRemove = async (memberId: string) => {
    const res = await removeMemberFromFamily(memberId);
    if (res.success) toast.success( "Member removed");
    else toast.error( "Failed to remove member");
  };

  const filteredAvailable = availableMembers.filter(m => 
    (m.firstName + ' ' + m.lastName).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md flex flex-col h-full px-3">
        <SheetHeader>
          <SheetTitle>Manage Members</SheetTitle>
          <SheetDescription>Add or remove members for {family.name}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-6 mt-6">
          {/* Current Members Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold mb-2">Current Members ({family.members.length})</h3>
            <ScrollArea className="flex-1 border rounded-lg p-2 bg-secondary/20">
              {family.members.length === 0 && <p className="text-sm text-muted-foreground p-2">No members yet.</p>}
              <div className="space-y-1">
                {family.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-md bg-background border shadow-sm">
                    <span className="text-sm">{member.firstName} {member.lastName}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={() => handleRemove(member.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Add Members Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold mb-2">Add Members</h3>
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search available members..." 
                className="pl-8" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ScrollArea className="flex-1 border rounded-lg p-2 bg-secondary/20">
              {filteredAvailable.length === 0 && <p className="text-sm text-muted-foreground p-2">No available members found.</p>}
              <div className="space-y-1">
                {filteredAvailable.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-md bg-background border shadow-sm group">
                    <span className="text-sm">{member.firstName} {member.lastName}</span>
                    <Button size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleAdd(member.id)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
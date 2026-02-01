'use client'

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Tent, UserCog } from 'lucide-react';

import { Family, User, Member } from '@/lib/types';
import { FamilyList } from '@/components/FamilyList';
import { UsersList } from '@/components/UserList';

interface FamiliesClientProps {
  initialFamilies: Family[];
  initialUsers: User[];
  availableMembers: Member[];
}

export function FamiliesClient({ initialFamilies, initialUsers, availableMembers }: FamiliesClientProps) {
  return (
    <div className="relative min-h-screen pb-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-20 right-1/3 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/20">
            <Tent className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Families</h1>
            <p className="text-muted-foreground">Manage small groups, leaders, and members</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="families" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white/40 dark:bg-black/20 border border-white/10 backdrop-blur-xl p-1 h-auto rounded-xl">
            <TabsTrigger value="families" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10">
              <Tent className="h-4 w-4" />
              Manage Families
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10">
              <UserCog className="h-4 w-4" />
              Manage Leaders
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="families" className="space-y-6">
          <FamilyList 
            families={initialFamilies} 
            users={initialUsers} 
            availableMembers={availableMembers} 
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersList users={initialUsers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
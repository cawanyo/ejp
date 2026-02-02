'use client'

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, Users, CheckCircle2, Clock, 
  Search, Plus, Phone, Mail, UserMinus, Filter 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { removeMemberFromFamily, addMemberToFamily } from '@/app/actions/family';

import { Family, Member } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';

interface FamilyManageClientProps {
  initialFamily: Family;
  initialAvailable: Member[];
}

export function FamilyManageClient({ initialFamily, initialAvailable }: FamilyManageClientProps) {
  
  // State
  const [family, setFamily] = useState(initialFamily);
  const [availableMembers, setAvailableMembers] = useState(initialAvailable);
  const [filter, setFilter] = useState<'all' | 'contacted' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addSearchQuery, setAddSearchQuery] = useState(''); // For the add modal

  // --- Derived Data ---
  const filteredMembers = family.members.filter(m => {
    const matchesSearch = (m.firstName + ' ' + m.lastName).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'contacted' ? m.isContacted :
      !m.isContacted;
    return matchesSearch && matchesFilter;
  });

  const filteredAvailable = availableMembers.filter(m => 
    (m.firstName + ' ' + m.lastName).toLowerCase().includes(addSearchQuery.toLowerCase())
  );

  const stats = {
    total: family.members.length,
    contacted: family.members.filter(m => m.isContacted).length,
    pending: family.members.filter(m => !m.isContacted).length,
  };

  const progress = stats.total > 0 ? (stats.contacted / stats.total) * 100 : 0;

  // --- Actions ---

  const handleRemove = async (memberId: string) => {
    const res = await removeMemberFromFamily(memberId);
    if (res.success) {
      toast.success( "Member Removed" );
      // Optimistic Update
      const removedMember = family.members.find(m => m.id === memberId);
      if (removedMember) {
        setFamily({ ...family, members: family.members.filter(m => m.id !== memberId) });
        setAvailableMembers([...availableMembers, { ...removedMember, familyId: null }]);
      }
    } else {
      toast("Error");
    }
  };

  const handleAdd = async (memberId: string) => {
    const res = await addMemberToFamily(family.id, memberId);
    if (res.success) {
      toast.success( "Member Added" );
      // Optimistic Update
      const addedMember = availableMembers.find(m => m.id === memberId);
      if (addedMember) {
        setAvailableMembers(availableMembers.filter(m => m.id !== memberId));
        setFamily({ ...family, members: [...family.members, { ...addedMember, familyId: family.id }] });
      }
    } else {
      toast("Error");
    }
  };

  return (
    <div className="min-h-screen pb-12 relative animate-in fade-in duration-500">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-black dark:to-gray-900" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-orange-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumb */}
        <Link href="/families" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Families
        </Link>

        {/* 1. Header Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Family Info */}
          <Card className="lg:col-span-2 border-none shadow-xl bg-white/60 dark:bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{family.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{family.address}</span>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
                  <Users className="h-7 w-7" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="flex-1 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Pilote</p>
                  {family.pilote ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{family.pilote.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{family.pilote.firstName} {family.pilote.lastName}</p>
                        <p className="text-xs text-muted-foreground">{family.pilote.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Not Assigned</span>
                  )}
                </div>
                <div className="flex-1 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">Copilote</p>
                  {family.copilote ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">{family.copilote.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{family.copilote.firstName} {family.copilote.lastName}</p>
                        <p className="text-xs text-muted-foreground">{family.copilote.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Not Assigned</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border-none shadow-xl bg-indigo-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
            
            <CardHeader>
              <CardTitle className="text-lg font-medium opacity-90">Suivi des contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-4xl font-bold">{progress.toFixed(0)}%</span>
                  <p className="text-indigo-100 text-sm">Contactés</p>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-semibold">{stats.contacted} <span className="text-base font-normal opacity-60">/ {stats.total}</span></div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex justify-between text-xs font-medium text-indigo-100 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {stats.contacted} Contaté(s)
                </div>
                <div className="flex items-center gap-1 opacity-70">
                  <Clock className="h-3 w-3" /> {stats.pending} En attente
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Controls Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
           <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full md:w-auto">
             <TabsList className="bg-white/50 dark:bg-white/5 border border-white/10 p-1">
               <TabsTrigger value="all" className="gap-2">
                 <Users className="h-4 w-4" /> Tout
               </TabsTrigger>
               <TabsTrigger value="contacted" className="gap-2">
                 <CheckCircle2 className="h-4 w-4" /> Contactés
               </TabsTrigger>
               <TabsTrigger value="pending" className="gap-2">
                 <Clock className="h-4 w-4" /> En attente
               </TabsTrigger>
             </TabsList>
           </Tabs>

           <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-[250px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Search members..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 bg-white/60 dark:bg-black/20 border-white/10"
               />
             </div>
             
             {/* ADD MEMBER SHEET */}
             <Sheet>
               <SheetTrigger asChild>
                 <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                   <Plus className="h-4 w-4" /> Ajouter un nouveau membre
                 </Button>
               </SheetTrigger>
               <SheetContent className="w-full sm:w-[500px] border-l border-white/10 bg-background/95 backdrop-blur-xl">
                 <SheetHeader>
                   <SheetTitle>Add to Family</SheetTitle>
                   <SheetDescription>Select unassigned members to add to {family.name}.</SheetDescription>
                 </SheetHeader>
                 <div className="py-6 h-full flex flex-col gap-4">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                       placeholder="Search unassigned..." 
                       value={addSearchQuery}
                       onChange={(e) => setAddSearchQuery(e.target.value)}
                       className="pl-9"
                     />
                   </div>
                   <ScrollArea className="flex-1 -mx-6 px-6">
                     <div className="space-y-2 pb-6">
                       {filteredAvailable.length === 0 ? (
                         <div className="text-center text-muted-foreground py-8">
                           No members found.
                         </div>
                       ) : (
                         filteredAvailable.map(m => (
                           <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors group">
                             <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                                 {m.firstName[0]}{m.lastName[0]}
                               </div>
                               <div>
                                 <p className="font-medium text-sm">{m.firstName} {m.lastName}</p>
                                 <p className="text-xs text-muted-foreground">{m.phone}</p>
                               </div>
                             </div>
                             <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-indigo-600 bg-indigo-50 hover:bg-indigo-100" onClick={() => handleAdd(m.id)}>
                               <Plus className="h-4 w-4" /> Add
                             </Button>
                           </div>
                         ))
                       )}
                     </div>
                   </ScrollArea>
                 </div>
               </SheetContent>
             </Sheet>
           </div>
        </div>

        {/* 3. Members List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className={`group border-none shadow-lg transition-all duration-300 hover:-translate-y-1 ${member.isContacted ? 'bg-white/80 dark:bg-white/5' : 'bg-white/60 dark:bg-white/5 border-l-4 border-l-orange-400'}`}>
               <CardHeader className="flex flex-row items-start justify-between pb-2">
                 <div className="flex items-center gap-3">
                   <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${member.isContacted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                     {member.firstName[0]}{member.lastName[0]}
                   </div>
                   <div>
                     <CardTitle className="text-base">{member.firstName} {member.lastName}</CardTitle>
                     <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="secondary" className={`text-[10px] h-5 ${member.isContacted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {member.isContacted ? 'Contacted' : 'Pending'}
                        </Badge>
                     </div>
                   </div>
                 </div>
                 {/* Remove Action */}
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                        <UserMinus className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Remove Member</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes vous sûr de vouloir supprimer <span className="font-semibold text-foreground">{member.firstName} {member.lastName}</span> de la famille <span className="font-semibold text-foreground">{family.name}</span>?
                            <br className="mt-2" />
                           
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        
                        <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleRemove(member.id)}
                            className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                        >
                            Supprimer
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>

               </CardHeader>
               
               <CardContent className="space-y-4 text-sm mt-2">
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <Phone className="h-3.5 w-3.5" /> <span>{member.phone}</span>
                   </div>
                   <div className="flex items-center gap-2 text-muted-foreground">
                     <Mail className="h-3.5 w-3.5" /> <span className="truncate">{member.email}</span>
                   </div>
                 </div>

                 {/* Leader Note Preview */}
                 {member.leaderNotes && (
                   <div className="p-3 bg-secondary/50 rounded-lg text-xs italic text-muted-foreground border border-black/5 dark:border-white/5">
                     "{member.leaderNotes}"
                   </div>
                 )}

                 {/* Status Footer */}
                 <div className="pt-3 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-xs text-muted-foreground">
                   <span>
                     {member.isContacted && member.contactDate 
                       ? `Contacted: ${format(member.contactDate, 'MMM d')}` 
                       : `Registered: ${format(member.registrationDate, 'MMM d')}`
                     }
                   </span>
                   
                   {/* Link to Follow Up Form (Internal shortcut) */}
                   <Link href={`/follow-up/${member.id}`} className="text-indigo-600 font-medium hover:underline">
                     Mettre à jour le suivi
                   </Link>
                 </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-20 bg-white/30 dark:bg-white/5 rounded-3xl border border-dashed border-white/20">
             <Filter className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-3" />
             <h3 className="text-lg font-medium">No members found</h3>
             <p className="text-muted-foreground">Try adjusting your filters or add a new member.</p>
          </div>
        )}
      </div>
    </div>
  );
}
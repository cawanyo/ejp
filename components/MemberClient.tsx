'use client'

import { useState, useEffect, useTransition } from 'react';
import { useDebounce } from 'use-debounce';
import { Users, Loader2 } from 'lucide-react';

// Types
import { Member, Metadata } from '@/lib/types';
import { deleteMember, getPaginatedMembers, updateMember } from '@/app/actions/member';
import { toast } from 'sonner';
import { MembersFilter } from './MemberFilter';
import { MembersTable } from './MemberTable';
import { PaginationControls } from './PaginationControl';
import { MemberSheet } from './MemberSheet';

// Actions


export function MembersClient({ 
  initialMembers, 
  initialMetadata
}: { 
  initialMembers: Member[], 
  initialMetadata: Metadata
}) {

  
  // Data State
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata);
  const [isPending, startTransition] = useTransition();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [gender, setGender] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Sheet & Action State
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Data
  const refreshData = async () => {
    startTransition(async () => {
      const result = await getPaginatedMembers({
        page,
        pageSize: 10,
        query: debouncedSearch,
        gender,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setMembers(result.members);
      setMetadata(result.metadata);
    });
  };

  useEffect(() => {
    refreshData();
  }, [debouncedSearch, gender, startDate, endDate, page]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, gender, startDate, endDate]);

  const clearFilters = () => {
    setSearchQuery('');
    setGender('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // 2. Handlers
  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setEditForm(member);
    setIsEditing(false);
    setIsSheetOpen(true);
  };

  const handleEditToggle = () => {
    if (isEditing && selectedMember) {
      setEditForm(selectedMember); // Revert changes if cancelling
    }
    setIsEditing(!isEditing);
  };

  const handleSaveMember = async () => {
    if (!selectedMember) return;
    setIsSaving(true);
    try {
      const result = await updateMember(selectedMember.id, editForm);
      if (result.success) {
        toast.success('Member details updated.' );
        setIsEditing(false);
        setIsSheetOpen(false);
        refreshData();
      } else {
        toast.error('Failed to update member.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    setIsDeleting(true);
    try {
      const result = await deleteMember(selectedMember.id);
      if (result.success) {
        toast.success('Member removed from database.' );
        setIsSheetOpen(false);
        refreshData();
      } else {
        toast.error('Failed to delete member.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen  pb-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col w-full md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Users className="h-3 w-3 md:h-6 md:w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Member Directory</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Nombre total de membres: <span className="font-semibold text-foreground">{metadata.total}</span>
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
            </p>
          </div>
        </div>
      </div>

      {/* Components */}
      <MembersFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        gender={gender}
        setGender={setGender}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClearFilters={clearFilters}
      />

      <MembersTable
        members={members}
        onViewMember={handleViewMember}
        isPending={isPending}
      />

      <PaginationControls
        metadata={metadata}
        setPage={setPage}
        isPending={isPending}
      />

      <MemberSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        member={selectedMember}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveMember}
        onDelete={handleDeleteMember}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />
    </div>
  );
}
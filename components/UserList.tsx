'use client'

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User as UserIcon, MoreHorizontal, Edit, Trash2, Search, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '@/lib/types';

import { deleteUser, getPaginatedUsers } from '@/app/actions/family';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserSheet } from './UserSheet';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { Input } from './ui/input';

interface UsersListProps {
  initialUsers: User[];
  initialMetadata: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export function UsersList({ initialUsers, initialMetadata }: UsersListProps) {

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [isLoading, setIsLoading] = useState(false);

  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(1);




  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // State for Editing
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // State for Deleting
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const res = await deleteUser(userToDelete.id);
    if (res.success) {
      toast.success( "Leader deleted");
    } else {
      toast.error( "Failed to delete user.");
    }
    setUserToDelete(null);
  };



  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getPaginatedUsers({
        page: page,
        query: debouncedQuery,
        pageSize: 8
      });
      setUsers(result.users);
      setMetadata(result.metadata);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast("Error loading leaders");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedQuery, toast]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page on search
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leaders..." 
            className="pl-9 bg-white/40 dark:bg-black/20 border-white/10 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isLoading && (
             <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
             </div>
          )}
          {!isLoading && searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button onClick={handleCreate} className="gap-2 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
          <Plus className="h-4 w-4" /> Add New Leader
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-white/40 dark:bg-black/20 backdrop-blur-xl border-white/10 group relative">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
              <div className="flex flex-row items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{user.firstName} {user.lastName}</CardTitle>
                  <p className="text-xs text-muted-foreground capitalize">{user.gender}</p>
                </div>
              </div>

              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteClick(user)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {users.length === 0 && !isLoading && (
        <div className="text-center py-10 text-muted-foreground">
          No leaders found matching "{searchQuery}"
        </div>
      )}

      {/* Pagination Controls */}
      {metadata.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground mx-2">
            Page {page} of {metadata.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))}
            disabled={page === metadata.totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Create/Edit Sheet */}
      <UserSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        user={selectedUser} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold text-foreground">{userToDelete?.firstName} {userToDelete?.lastName}</span>.
              If they are assigned as a Pilote or Copilote to any family, they will be unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
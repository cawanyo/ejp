'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User as UserIcon, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { User } from '@/lib/types';

import { deleteUser } from '@/app/actions/family';
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

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {

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

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate} className="gap-2">
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
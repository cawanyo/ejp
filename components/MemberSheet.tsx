'use client'

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit2, Save, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Member } from '@/lib/types';

interface MemberSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  isEditing: boolean;
  onEditToggle: () => void;
  editForm: Partial<Member>;
  setEditForm: (data: Partial<Member>) => void;
  onSave: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function MemberSheet({
  isOpen,
  onOpenChange,
  member,
  isEditing,
  onEditToggle,
  editForm,
  setEditForm,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: MemberSheetProps) {
  if (!member) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className=" max-w-[540px] overflow-y-auto p-3 ml-3 ">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            {isEditing ? 'Modifier' : 'Détails'}
            <Badge variant="outline" className="ml-2 font-normal text-xs capitalize">
              {member.gender}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {isEditing 
              ? 'Update the member information below.' 
              : `Registered on ${format(parseISO(member.registrationDate), 'PPP')}`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="grid gap-4">
            <div className="gap-2 grid  grid-col-1 md:grid-cols-2 ">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénoms</Label>
                <Input 
                  id="firstName" 
                  value={editForm.firstName || ''} 
                  disabled={!isEditing}
                  onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  value={editForm.lastName || ''} 
                  disabled={!isEditing}
                  onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={editForm.email || ''} 
                disabled={!isEditing}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>

            <div className="gap-2 grid  grid-col-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Télephone</Label>
                <Input 
                  id="phone" 
                  value={editForm.phone || ''} 
                  disabled={!isEditing}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date de Naissance</Label>
                <Input 
                  id="dob" 
                  type="date"
                  value={editForm.dateOfBirth ? format(new Date(editForm.dateOfBirth), 'yyyy-MM-dd') : ''}
                  disabled={!isEditing}
                  onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input 
                id="address" 
                value={editForm.address || ''} 
                disabled={!isEditing}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
              />
            </div>

            {/* Parent Section */}
            {/* <div className="p-4 rounded-lg bg-secondary/30 space-y-4 border">
              <h3 className="font-semibold text-sm">Parent Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent Name</Label>
                  <Input 
                    id="parentName" 
                    value={editForm.parentName || ''} 
                    disabled={!isEditing}
                    onChange={(e) => setEditForm({...editForm, parentName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent Phone</Label>
                  <Input 
                    id="parentPhone" 
                    value={editForm.parentPhone || ''} 
                    disabled={!isEditing}
                    onChange={(e) => setEditForm({...editForm, parentPhone: e.target.value})}
                  />
                </div>
              </div>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                className="min-h-[100px]"
                value={editForm.notes || ''} 
                disabled={!isEditing}
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2 sm:justify-between border-t pt-6">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2" disabled={isSaving}>
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Vous êtes sûr?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Cela supprimera
                    <span className="font-semibold text-foreground"> {member.firstName} {member.lastName}</span> de la base de données.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {isDeleting ? 'Deleting...' : 'Delete Member'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            
            {isEditing ? (
              <Button onClick={onSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Enrégistrer
              </Button>
            ) : (
              <Button onClick={onEditToggle} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Modifier les détails
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
'use client'

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createUser, updateUser } from '@/app/actions/family';
import { toast } from 'sonner';
import { User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Loader2, Save, UserCog } from 'lucide-react';


const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  gender: z.enum(['male', 'female', 'other']),
});

interface UserSheetProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  user?: User | null; // Optional user for editing
}

export function UserSheet({ open, onOpenChange , user}: 

UserSheetProps
) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', gender: undefined }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (user) {
        // Normalize gender to lowercase to ensure it matches Select values
        const safeGender = (user.gender?.toLowerCase() || 'other') as 'male' | 'female' | 'other';
        const validGender = ['male', 'female', 'other'].includes(safeGender) ? safeGender : 'other';

        form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          gender: validGender,
        });
      } else {
        // Clear form for "Create New" mode
        form.reset({ 
          firstName: '', 
          lastName: '', 
          email: '', 
          phone: '', 
          gender: undefined 
        });
      }
    }
  }, [user, open, form]);

  const onSubmit = async (data: any) => {
    let res;
    if (user) {
      // Update existing user
      res = await updateUser(user.id, data);
    } else {
      // Create new user
      res = await createUser(data);
    }

    if (res.success) {
      toast( user ? "Leader details updated." : "New leader added." );
      onOpenChange(false);
    } else {
      toast("Something went wrong.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] border-l border-white/10 bg-background/95 backdrop-blur-xl px-2">
        <SheetHeader className="pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl">{user ? 'Edit Leader' : 'Add Leader'}</SheetTitle>
              <SheetDescription>{user ? 'Update details below.' : 'Add a new leadership team member.'}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="firstName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/50 dark:bg-black/20 border-white/10 focus:bg-white dark:focus:bg-black/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="lastName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/50 dark:bg-black/20 border-white/10 focus:bg-white dark:focus:bg-black/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="bg-white/50 dark:bg-black/20 border-white/10 focus:bg-white dark:focus:bg-black/40" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/50 dark:bg-black/20 border-white/10 focus:bg-white dark:focus:bg-black/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="gender" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <SheetFooter className="mt-auto border-t border-white/10 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md shadow-orange-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> {user ? 'Save Changes' : 'Create User'}
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
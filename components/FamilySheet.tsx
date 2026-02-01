'use client'

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AddressInput } from '@/components/ui/address-input';
import { createFamily, updateFamily } from '@/app/actions/family';
import { Family, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Tent } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  piloteId: z.string().optional(),
  copiloteId: z.string().optional(),
  latitude: z.number().optional(), // Add hidden fields
  longitude: z.number().optional(),
});

interface FamilySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  family: Family | null;
  users: User[];
}

export function FamilySheet({ open, onOpenChange, family, users }: FamilySheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', address: '', piloteId: 'none', copiloteId: 'none' }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opening/changing family
  useEffect(() => {
    if (family) {
      form.reset({
        name: family.name,
        address: family.address,
        piloteId: family.piloteId || 'none',
        copiloteId: family.copiloteId || 'none',
        latitude: family.latitude || undefined,
        longitude: family.longitude || undefined,
      });
    } else {
      form.reset({ name: '', address: '', piloteId: 'none', copiloteId: 'none', latitude: undefined, longitude: undefined } );
    }
  }, [family, open, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      piloteId: data.piloteId === 'none' ? null : data.piloteId,
      copiloteId: data.copiloteId === 'none' ? null : data.copiloteId,
    };

    let res;
    if (family) {
      res = await updateFamily(family.id, payload);
    } else {
      res = await createFamily(payload);
    }

    if (res.success) {
      toast.success( family ? "Family updated" : "Family created");
      onOpenChange(false);
    } else {
      toast.error("Error");
    }
    setIsSubmitting(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] border-l border-white/10 bg-background/95 backdrop-blur-xl px-2">
        <SheetHeader className="pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <Tent className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl">{family ? 'Edit Family' : 'Create New Family'}</SheetTitle>
              <SheetDescription>Configure family details and leadership.</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-6 mt-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. The Lions" 
                        {...field} 
                        className="bg-white/50 dark:bg-black/20 border-white/10 focus:bg-white dark:focus:bg-black/40 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                       {/* AddressInput already has the glass style applied internally */}
                       <AddressInput 
                            value={field.value} 
                            onAddressSelect={(addr, lat, lon) => {
                              field.onChange(addr); // Set address string
                              form.setValue('latitude', lat); // Set hidden lat
                              form.setValue('longitude', lon); // Set hidden lon
                            }} 
                            placeholder="Search for a valid address..."
                          />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Leadership Section */}
            <div className="p-5 rounded-xl bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30 space-y-4">
              <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300 flex items-center gap-2">
                Leadership Team
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="piloteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-muted-foreground font-semibold">Pilote</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/70 dark:bg-black/30 border-orange-200/50 dark:border-orange-800/50">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">-- No Pilote --</SelectItem>
                          {users.map(u => (
                            <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="copiloteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-muted-foreground font-semibold">Copilote</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/70 dark:bg-black/30 border-orange-200/50 dark:border-orange-800/50">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">-- No Copilote --</SelectItem>
                          {users.map(u => (
                            <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
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
                    <Save className="mr-2 h-4 w-4" /> Save Family
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
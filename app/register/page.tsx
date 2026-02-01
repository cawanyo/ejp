'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Save, ArrowLeft, Loader2, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { createMember } from '../actions/member';
import { toast } from 'sonner';
import { AddressInput } from '@/components/ui/address-input';
import { useRouter } from 'next/navigation';

// Form Validation Schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']).refine(value => value !== undefined, { message: 'Please select a gender' }),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  notes: z.string().optional(),
  latitude: z.number().optional(), // Add hidden fields
  longitude: z.number().optional(),
});

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // Initialize Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: undefined,
      address: '',
      parentName: '',
      parentPhone: '',
      notes: '',
    },
  });

  // Handle Submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await createMember(data);
      toast('Registration Successful!');
        // REDIRECT TO ASSIGNMENT PAGE
      router.push(`/members/${result.id}/assign`);
      form.reset(); // Optionally reset form after success
    } catch (error) {
      toast('Something went wrong. Please try again.');
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      
      {/* 1. Ambient Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">

          {/* LEFT COLUMN: Info & Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
            
            {/* Back Link */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Tableau de bord
            </Link>

            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 text-white">
                <UserPlus className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                Enrégistrer <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Nouvelle personne
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
              Assurez-vous que toutes les informations sont exactes avant de soumettre.
              </p>
            </div>

            {/* Info Cards / Tips (Only visible on large screens for layout balance) */}
            <div className="hidden lg:grid gap-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg h-fit">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Information sécurisées</h3>
                  <p className="text-sm text-muted-foreground">Uniquement disponible par les admin</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg h-fit">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Information des parents</h3>
                  <p className="text-sm text-muted-foreground">Utile pour ceux qui sont encore mineurs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:col-span-7 w-full">
            <Card className="border-white/10 shadow-2xl bg-white/40 dark:bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 overflow-hidden">
              <CardHeader className="bg-white/50 dark:bg-white/5 border-b border-white/5 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      Informations du membre
                    </CardTitle>
                    <CardDescription>
                      Veillez obligatoirement remplir les cases notées (*)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Basic Info */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénoms <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="John" className="bg-white/50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition-colors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de famille <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" className="bg-white/50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition-colors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" className="bg-white/50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition-colors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" className="bg-white/50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition-colors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Personal Details */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de naissance <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="date" className="bg-white/50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition-colors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition-colors">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Homme</SelectItem>
                                <SelectItem value="female">Femme</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
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

                    {/* Parent Info Section */}
                    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 space-y-4">
                      <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        Personne à contacter en cas d'urgence
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-70 ml-auto bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-full text-indigo-700 dark:text-indigo-300">Optional</span>
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="parentName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" className="bg-white/70 dark:bg-black/40 border-indigo-200 dark:border-indigo-800 focus:border-indigo-400" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="parentPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telephone</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 000-0000" className="bg-white/70 dark:bg-black/40 border-indigo-200 dark:border-indigo-800 focus:border-indigo-400" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Informations supplémentaires</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any allergies, special requirements, or additional information..." 
                              className="resize-none min-h-[100px] bg-white/50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 transition-colors" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] h-12 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Enrégistrement en cours...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          Enrégistrer la personne
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
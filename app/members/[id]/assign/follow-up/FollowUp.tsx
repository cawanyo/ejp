'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Calendar, CheckCircle2, Save, Loader2, ArrowLeft } from 'lucide-react';
import { updateMemberFollowUp } from '@/app/actions/follow-up';

import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

export function FollowUpClient({ member }: { member: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [isContacted, setIsContacted] = useState(member.isContacted);
  const [notes, setNotes] = useState(member.leaderNotes || '');

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await updateMemberFollowUp(member.id, {
        isContacted,
        leaderNotes: notes
      });

      if (res.success) {
        toast( "Merci !" );
      } else {
        toast("Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" />
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Member Info Card */}
        <Card className="border-t-4 border-t-indigo-500 shadow-xl bg-white/60 dark:bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{member.firstName} {member.lastName}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  Assiggné à la FI: <Badge variant="outline" className="font-semibold">{member.family?.name || 'Unassigned'}</Badge>
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                {member.firstName[0]}{member.lastName[0]}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-white/10">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{member.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-white/10">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium truncate">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-white/10 md:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Adresse</p>
                  <p className="font-medium">{member.address}</p>
                </div>
              </div>
            </div>
            
            {member.notes && (
               <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 text-sm border border-amber-100">
                 <strong>Notes:</strong> {member.notes}
               </div>
            )}
          </CardContent>
        </Card>

        {/* Follow-up Action Card */}
        <Card className="shadow-lg border-indigo-100 dark:border-indigo-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-600" />
              Retour 
            </CardTitle>
            <CardDescription>
              Avez vous contacté ce membre ? Enregistrez vos notes ci-dessous.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 dark:border-indigo-900 dark:bg-indigo-900/10">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Contact Status</Label>
                <p className="text-sm text-muted-foreground">
                  Cocher si vous avez contacté ce membre.
                </p>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`text-sm font-bold ${isContacted ? 'text-green-600' : 'text-gray-400'}`}>
                   {isContacted ? 'CONTACTED' : 'PENDING'}
                 </span>
                 <Switch 
                   checked={isContacted}
                   onCheckedChange={setIsContacted}
                   className="data-[state=checked]:bg-green-600"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Informations particulières</Label>
              <Textarea 
                placeholder="Comment s'est passé l'appel ? Des suivis nécessaires ?"
                className="min-h-[120px] resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t flex justify-end py-4">
             <Button 
               onClick={handleSave} 
               disabled={isSubmitting}
               className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                 </>
               ) : (
                 <>
                   <Save className="mr-2 h-4 w-4" /> Save Report
                 </>
               )}
             </Button>
          </CardFooter>
        </Card>

        {member.contactDate && (
          <p className="text-center text-xs text-muted-foreground">
            Last updated: {format(parseISO(member.updatedAt), 'PPP p')}
          </p>
        )}
      </div>
    </div>
  );
}
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, CheckCircle2, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { addMemberToFamily } from '@/app/actions/family';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';



export function AssignClient({ member, families }: { member: any, families: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ show: boolean, link: string | null }>({ show: false, link: null });

  const handleAssign = async (familyId: string, familyName: string) => {
    setLoadingId(familyId);
    try {
      const res = await addMemberToFamily(familyId, member.id);
      if (res.success) {
        setSuccessData({ 
          show: true, 
          link: res.whatsappLink || null 
        });
        toast(`Assignment Complete ${member.firstName} has been added to ${familyName}.`,
       );
      } else {
        toast("Error");
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleSkip = () => {
    router.push('/members');
  };
  const handleFinish = () => {
    router.push('/members');
  };

  const openWhatsApp = () => {
    if (successData.link) {
      window.open(successData.link, '_blank');
      // Optional: Close modal after clicking
      // handleFinish(); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" />
      
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
             <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Enrégistrement réussi!</h1>
          <p className="text-xl text-muted-foreground">
            Les familles d'impact les plus proches <span className="font-semibold text-foreground">{member.firstName}</span>.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/20 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            En fonction de l'adresse: {member.address}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {families.length === 0 ? (
             <div className="col-span-3 text-center py-12 text-muted-foreground bg-white/40 rounded-xl border border-dashed border-white/20">
               No families found nearby with valid coordinates.
             </div>
          ) : (
            families.map((family, index) => (
              <Card key={family.id} className={`relative border-2 transition-all hover:-translate-y-1 ${index === 0 ? 'border-indigo-500 shadow-xl shadow-indigo-500/10' : 'border-transparent hover:border-indigo-200'}`}>
                {index === 0 && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                     Le plus proche
                   </div>
                )}
                <CardHeader>
                  <CardTitle>{family.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> 
                    {family.distance.toFixed(1)} km 
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {family.address}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                      Pilote: {family.pilote?.lastName || 'None'}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                       {family.members.length} Membres
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleAssign(family.id, family.name)}
                    disabled={!!loadingId}
                    variant={index === 0 ? "default" : "outline"}
                  >
                    {loadingId === family.id ? "Assigning..." : "Assigner à cette famille"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground hover:text-foreground">
            Faire apès <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>




      <Dialog open={successData.show} onOpenChange={(open) => !open && handleFinish()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" /> Assignment Complete
            </DialogTitle>
            <DialogDescription>
              {member.firstName} a bien été ajouté à la famille.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center font-medium">
              Notifier le pilote via WhatsApp pour lui communiquer les informations du nouveau membre et faciliter la prise de contact.
            </p>
            
            {successData.link ? (
              <Button 
                onClick={openWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 text-lg shadow-lg shadow-green-500/20"
              >
                <Send className="mr-2 h-5 w-5" /> Envoyez le message WhatsApp
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                (No phone number available for the Pilote)
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-between flex-row items-center">
            <Button variant="ghost" onClick={handleFinish} className="text-muted-foreground">
              Passer
            </Button>
            <Button variant="outline" onClick={handleFinish}>
              Terminer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



    </div>
  );
}
'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-green-100 shadow-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center text-center p-8 sm:p-12 space-y-6">
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2"
            >
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Merci
              </h1>
              <p className="text-muted-foreground text-lg">
                Le rapport a été soumis avec succès. Nous apprécions votre contribution pour aider les nouvelles familles d'impact à se sentir accueillies et soutenues.
              </p>
            </div>

 

            <div className="pt-4 w-full">
              <Link href="/" className="w-full">
                <Button className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/20">
                  Aller Dashaboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
import Link from 'next/link';
import { Users, UserPlus, TrendingUp, Calendar, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, isThisMonth, isThisWeek, isThisYear, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getMembers } from './actions/member';

export default async function Dashboard() {
  const members = await getMembers();

  const stats = {
    total: members.length,
    thisMonth: members.filter(m => isThisMonth(m.registrationDate)).length,
    thisWeek: members.filter(m => isThisWeek(m.registrationDate)).length,
    thisYear: members.filter(m => isThisYear(m.registrationDate)).length,
  };

  const recentMembers = members.slice(0, 5);

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500">
      
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl">
            Tableau de bord des{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Intégration
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Gérez l'intégration des nouvelles personnes
          </p>
        </div>

        <Link href="/register">
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:scale-105"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Ajouter une nouvelle personne
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Personnes enregistrées"
          value={stats.total}
          icon={<Users className="h-6 w-6" />}
          description=""
          color="indigo"
        />
        <StatCard
          title="Nouvelles ce mois"
          value={stats.thisMonth}
          icon={<Calendar className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Nouvelles cette semaine"
          value={stats.thisWeek}
          icon={<TrendingUp className="h-6 w-6" />}
          color="pink"
        />
        <StatCard
          title="Nouvelles cette année"
          value={stats.thisYear}
          icon={<Sparkles className="h-6 w-6" />}
          color="amber"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Familles récentes */}
        <Card className="md:col-span-4 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">
                Personnes récemment enregistrées
              </CardTitle>
              <CardDescription>
                Ils nous ont rejoint
              </CardDescription>
            </div>
            <Link href="/members">
              <Button variant="ghost" size="sm" className="gap-1 text-indigo-600">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 pt-4">
              {recentMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Activity className="h-10 w-10 mb-2 opacity-20" />
                  <p>Aucune inscription pour le moment.</p>
                </div>
              ) : (
                recentMembers.map((member, i) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/60 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                          i % 2 === 0
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {format(member.registrationDate, 'dd MMM', {
                        locale: fr,
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="md:col-span-3 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Actions rapides
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Accès direct aux actions principales
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Link href="/register">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20">
                <UserPlus />
                <div>
                  <p className="font-semibold text-sm">
                    Enregistrer une personne
                  </p>
                  <p className="text-xs text-indigo-100">
                    Ajouter une nouvelle personne
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/statistics">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20">
                <Activity />
                <div>
                  <p className="font-semibold text-sm">
                    Voir les statistiques
                  </p>
                  <p className="text-xs text-indigo-100">
                    Suivre l’évolution
                  </p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

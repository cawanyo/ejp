import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: { value: number; label: string };
  className?: string;
  color?: 'indigo' | 'purple' | 'pink' | 'amber' | 'blue';
}

const colorStyles = {
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300",
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
};

export function StatCard({ title, value, icon, description, trend, className, color = 'blue' }: StatCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden border-white/10 shadow-lg bg-white/50 dark:bg-black/20 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm", colorStyles[color])}>
            {icon}
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-full border border-border/50">
              <span className={cn(
                "font-bold",
                trend.value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground font-medium opacity-80">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
'use client'

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Metadata } from '@/lib/types';

interface PaginationControlsProps {
  metadata: Metadata;
  setPage: (page: number | ((p: number) => number)) => void;
  isPending: boolean;
}

export function PaginationControls({ metadata, setPage, isPending }: PaginationControlsProps) {
  if (metadata.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{(metadata.page - 1) * metadata.pageSize + 1}</span> to <span className="font-medium">{Math.min(metadata.page * metadata.pageSize, metadata.total)}</span> of <span className="font-medium">{metadata.total}</span> entries
      </p>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={!metadata.hasPrevPage || isPending}
          className="gap-1 border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-1 min-w-[3rem] justify-center text-sm font-medium">
          Page {metadata.page} of {metadata.totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))}
          disabled={!metadata.hasNextPage || isPending}
          className="gap-1 border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-sm"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
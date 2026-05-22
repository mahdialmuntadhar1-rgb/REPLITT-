import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-neutral-200 rounded-2xl", className)} />
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full relative h-[400px] md:h-[500px] bg-neutral-100 rounded-[48px] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 animate-pulse bg-neutral-200" />
      <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col items-center text-center space-y-6">
        <Skeleton className="h-12 w-3/4 rounded-full" />
        <Skeleton className="h-6 w-1/2 rounded-full" />
        <Skeleton className="h-14 w-40 rounded-2xl" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6 mt-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white p-6 rounded-[32px] border border-neutral-100 flex flex-col items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-2xl" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="bg-white rounded-[40px] overflow-hidden border border-neutral-100 shadow-sm flex flex-col h-full">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-8 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="pt-4 border-t border-neutral-50 flex justify-between items-center">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SocialPostSkeleton() {
  return (
    <div className="bg-white rounded-[40px] border border-neutral-100 overflow-hidden shadow-sm">
      <div className="p-6 flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="aspect-video w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-6 pt-4 border-t border-neutral-50">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

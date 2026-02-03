// src/components/layout/MainContent.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main
      className={cn(
        'flex-1 overflow-auto p-6 bg-muted',
        className
      )}
    >
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </main>
  );
}

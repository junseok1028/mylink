'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] transition-all animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      {children}
    </div>
  );
}

export function DialogContent({
  className,
  children,
  onClose,
}: {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        'relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 transition-all duration-200 animate-in zoom-in-95',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-left mb-4', className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={cn('text-lg font-bold text-[#191F28] tracking-tight leading-snug', className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn('text-xs text-[#8B95A1] leading-relaxed', className)}>
      {children}
    </p>
  );
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100', className)}>
      {children}
    </div>
  );
}

export function DialogClose({
  onClose,
  className,
}: {
  onClose?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        'absolute right-4 top-4 rounded-full p-1.5 text-[#8B95A1] hover:text-[#191F28] hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200',
        className
      )}
      aria-label="닫기"
    >
      <X className="h-4 w-4" />
    </button>
  );
}

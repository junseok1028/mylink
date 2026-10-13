'use client';

import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {children}
        </div>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <BaseDialog.Popup
      className={cn(
        'pointer-events-auto relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 outline-none transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
        className
      )}
    >
      {children}
    </BaseDialog.Popup>
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
    <BaseDialog.Title
      className={cn(
        'text-lg font-bold text-[#191F28] tracking-tight leading-snug',
        className
      )}
    >
      {children}
    </BaseDialog.Title>
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
    <BaseDialog.Description
      className={cn('text-xs text-[#8B95A1] leading-relaxed', className)}
    >
      {children}
    </BaseDialog.Description>
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
    <div
      className={cn(
        'flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogClose({
  className,
}: {
  className?: string;
}) {
  return (
    <BaseDialog.Close
      className={cn(
        'absolute right-4 top-4 rounded-full p-1.5 text-[#8B95A1] hover:text-[#191F28] hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer',
        className
      )}
      aria-label="닫기"
    >
      <X className="h-4 w-4" />
    </BaseDialog.Close>
  );
}

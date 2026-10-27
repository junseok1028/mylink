'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LinkItem } from '@/lib/types';
import { LinkIcon } from '@/components/link-icon';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkItem | null;
  onConfirmDelete: (id: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
  onConfirmDelete,
  isDeleting = false,
}: DeleteLinkDialogProps) {
  if (!link) return null;

  const handleDelete = async () => {
    await onConfirmDelete(link.id);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isDeleting && onOpenChange(val)}>
      <DialogContent className="max-w-sm">
        {!isDeleting && <DialogClose />}

        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          {/* 링크 이름 표시 */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <LinkIcon
              url={link.url}
              title={link.title}
              className="w-10 h-10 shrink-0"
              size={20}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[#191F28] truncate">
                {link.title}
              </p>
              {link.description && (
                <p className="text-[12px] text-[#8B95A1] truncate mt-0.5">
                  {link.description}
                </p>
              )}
            </div>
          </div>

          {/* 경고 문구 */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[12px] font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>이 작업은 되돌릴 수 없습니다.</span>
          </div>
        </div>

        <DialogFooter className="mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-xl"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                삭제 중...
              </>
            ) : (
              '삭제하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

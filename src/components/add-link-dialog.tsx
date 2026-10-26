'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkItem } from '@/lib/types';
import { PlusCircle, Globe, Type, FileText, FolderPlus, AlertCircle } from 'lucide-react';

const EMOJI_PRESETS = ['🚀', '🎨', '📖', '📺', '💬', '💻', '🔗', '⭐'];

// 1. Zod 스키마 정의
export const addLinkSchema = z
  .object({
    title: z
      .string()
      .min(1, '링크 제목을 입력해주세요.')
      .max(60, '링크 제목은 최대 60자까지 입력 가능합니다.'),
    url: z
      .string()
      .min(1, '연결할 URL을 입력해주세요.')
      .refine(
        (val) => {
          const trimmed = val.trim();
          if (trimmed.startsWith('mailto:')) return true;
          // http 또는 https 프로토콜이 없는 경우 붙여서 유효한 URL인지 확인
          const testUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
          try {
            const parsed = new URL(testUrl);
            return parsed.hostname.includes('.');
          } catch {
            return false;
          }
        },
        { message: '올바른 형식의 웹 주소(URL)를 입력해주세요.' }
      ),
    description: z
      .string()
      .max(120, '상세 설명은 최대 120자까지 입력 가능합니다.')
      .optional(),
    isCustomSection: z.boolean(),
    selectedSection: z.string(),
    customSection: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isCustomSection) {
      if (!data.customSection || !data.customSection.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customSection'],
          message: '새 섹션 이름을 입력해주세요.',
        });
      }
    }
  });

export type AddLinkFormValues = z.infer<typeof addLinkSchema>;

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSections: string[];
  onAddLink: (link: Omit<LinkItem, 'id' | 'is_active' | 'display_order'>) => void | Promise<void>;
  defaultSection?: string;
}

export function AddLinkDialog({
  open,
  onOpenChange,
  existingSections,
  onAddLink,
  defaultSection,
}: AddLinkDialogProps) {
  const initialSection = defaultSection || existingSections[0] || '🚀 주요 프로젝트 & 포트폴리오';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      isCustomSection: false,
      selectedSection: initialSection,
      customSection: '',
    },
    mode: 'onChange',
  });

  const titleValue = watch('title');
  const isCustomSection = watch('isCustomSection');
  const selectedSection = watch('selectedSection');

  // 다이얼로그 열릴 때 폼 초기화
  React.useEffect(() => {
    if (open) {
      reset({
        title: '',
        url: '',
        description: '',
        isCustomSection: false,
        selectedSection: defaultSection || existingSections[0] || '🚀 주요 프로젝트 & 포트폴리오',
        customSection: '',
      });
    }
  }, [open, defaultSection, existingSections, reset]);

  const handleEmojiClick = (emoji: string) => {
    const currentTitle = titleValue || '';
    if (!currentTitle.startsWith(emoji)) {
      setValue('title', `${emoji} ${currentTitle.trimStart()}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (data: AddLinkFormValues) => {
    let finalUrl = data.url.trim();
    if (
      !finalUrl.startsWith('http://') &&
      !finalUrl.startsWith('https://') &&
      !finalUrl.startsWith('mailto:')
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    const finalSection = data.isCustomSection
      ? (data.customSection?.trim() || '기타')
      : data.selectedSection;

    await onAddLink({
      title: data.title.trim(),
      url: finalUrl,
      description: data.description?.trim() || undefined,
      section: finalSection,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogClose />

        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-blue-50 text-blue-600">
              <PlusCircle className="w-5 h-5" />
            </span>
            <DialogTitle>새 링크 추가하기</DialogTitle>
          </div>
          <DialogDescription>
            프로필에 노출될 새로운 링크 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
          {/* 1. 제목 입력 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#333D4B] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#8B95A1]" />
              링크 제목 <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="예: 🎨 마이링크 (MyLink) 서비스"
              {...register('title')}
              className={errors.title ? 'border-red-400 focus:ring-red-400/20' : ''}
              autoFocus
            />
            {errors.title && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.title.message}
              </p>
            )}

            {/* 빠른 이모지 추천 칩 */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
              <span className="text-[11px] text-[#8B95A1] shrink-0">빠른 이모지:</span>
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="px-2 py-0.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 2. URL 입력 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#333D4B] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#8B95A1]" />
              연결할 URL <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="https://github.com/..."
              {...register('url')}
              className={errors.url ? 'border-red-400 focus:ring-red-400/20' : ''}
            />
            {errors.url && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.url.message}
              </p>
            )}
            <p className="text-[11px] text-[#8B95A1]">
              * http:// 또는 https:// 가 없으면 자동으로 붙여드려요.
            </p>
          </div>

          {/* 3. 설명 입력 (선택) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#333D4B] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#8B95A1]" />
              상세 설명 <span className="text-[#8B95A1] font-normal">(선택)</span>
            </label>
            <Input
              placeholder="예: 토스 디자인 시스템 기반의 바이오 프로필 서비스"
              {...register('description')}
              className={errors.description ? 'border-red-400 focus:ring-red-400/20' : ''}
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.description.message}
              </p>
            )}
          </div>

          {/* 4. 섹션 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#333D4B] flex items-center gap-1.5">
              <FolderPlus className="w-3.5 h-3.5 text-[#8B95A1]" />
              노출 섹션
            </label>
            <div className="flex flex-wrap gap-1.5">
              {existingSections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setValue('selectedSection', sec);
                    setValue('isCustomSection', false, { shouldValidate: true });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    !isCustomSection && selectedSection === sec
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200/70'
                  }`}
                >
                  {sec}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setValue('isCustomSection', true, { shouldValidate: true });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCustomSection
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200/70'
                }`}
              >
                + 새 섹션 입력
              </button>
            </div>

            {isCustomSection && (
              <div className="pt-1 animate-in fade-in space-y-1">
                <Input
                  placeholder="새 섹션 이름 (예: 💼 경력 & 프로젝트)"
                  {...register('customSection')}
                  className={errors.customSection ? 'border-red-400 focus:ring-red-400/20' : ''}
                  autoFocus
                />
                {errors.customSection && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.customSection.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {isSubmitting ? '추가 중...' : '추가하기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

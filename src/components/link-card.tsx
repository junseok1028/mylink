'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkItem } from '@/lib/types';
import { ChevronRight, Pencil, Trash2, X, Check, AlertCircle, Loader2, Clock } from 'lucide-react';
import { LinkIcon } from '@/components/link-icon';

function formatUpdatedAt(val: any): string | null {
  if (!val) return null;
  try {
    let date: Date | null = null;
    if (typeof val?.toDate === 'function') date = val.toDate();
    else if (typeof val?.seconds === 'number') date = new Date(val.seconds * 1000);
    else if (val instanceof Date) date = val;
    else if (typeof val === 'number') date = new Date(val);
    else if (typeof val === 'string') date = new Date(val);

    if (!date || isNaN(date.getTime())) return null;
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    if (isToday) {
      return `오늘 ${hours}:${minutes} 수정됨`;
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일 수정됨`;
  } catch {
    return null;
  }
}

const EMOJI_PRESETS = ['🚀', '🎨', '📖', '📺', '💬', '💻', '🔗', '⭐'];

// 추가 다이얼로그와 동일한 입력 검증 스키마
export const editLinkSchema = z.object({
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
  section: z
    .string()
    .min(1, '섹션 이름을 입력해주세요.')
    .max(40, '섹션 이름은 최대 40자까지 입력 가능합니다.'),
});

export type EditLinkFormValues = z.infer<typeof editLinkSchema>;

interface LinkCardProps {
  link: LinkItem;
  existingSections?: string[];
  onUpdate?: (id: string, updates: Partial<LinkItem>) => Promise<void> | void;
  onDeleteRequest?: (link: LinkItem) => void;
}

/**
 * LinkCard with:
 * - Hover edit/delete action buttons
 * - Inline edit UI with input validation identical to Add dialog
 * - Toss TDS styling
 */
export function LinkCard({
  link,
  existingSections = [],
  onUpdate,
  onDeleteRequest,
}: LinkCardProps) {
  const [isInlineEditing, setIsInlineEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const updatedTime = formatUpdatedAt(link.updatedAt || link.updated_at);

  const href =
    link.url.startsWith('http') || link.url.startsWith('mailto:')
      ? link.url
      : `https://${link.url}`;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditLinkFormValues>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
      description: link.description || '',
      section: link.section || '기타',
    },
    mode: 'onChange',
  });

  const titleValue = watch('title');
  const sectionValue = watch('section');

  // Reset form values if link changes
  React.useEffect(() => {
    reset({
      title: link.title,
      url: link.url,
      description: link.description || '',
      section: link.section || '기타',
    });
  }, [link, reset]);

  const handleEmojiClick = (emoji: string) => {
    const currentTitle = titleValue || '';
    if (!currentTitle.startsWith(emoji)) {
      setValue('title', `${emoji} ${currentTitle.trimStart()}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    reset({
      title: link.title,
      url: link.url,
      description: link.description || '',
      section: link.section || '기타',
    });
    setIsInlineEditing(true);
  };

  const handleCancelEdit = () => {
    reset({
      title: link.title,
      url: link.url,
      description: link.description || '',
      section: link.section || '기타',
    });
    setIsInlineEditing(false);
  };

  const onSubmit = async (data: EditLinkFormValues) => {
    if (!onUpdate) return;

    let finalUrl = data.url.trim();
    if (
      !finalUrl.startsWith('http://') &&
      !finalUrl.startsWith('https://') &&
      !finalUrl.startsWith('mailto:')
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      setIsSubmitting(true);
      await onUpdate(link.id, {
        title: data.title.trim(),
        url: finalUrl,
        description: data.description?.trim() || undefined,
        section: data.section.trim() || '기타',
      });
      setIsInlineEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. 인라인 편집 모드 UI
  if (isInlineEditing) {
    return (
      <Card className="rounded-2xl border-2 border-blue-500 bg-white shadow-md p-4 transition-all duration-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <Pencil className="w-3.5 h-3.5" />
              <span>링크 인라인 수정</span>
            </div>
            <div className="flex items-center gap-2">
              {updatedTime && (
                <span className="text-[10px] text-[#8B95A1] font-normal flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {updatedTime}
                </span>
              )}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCancelEdit}
                className="text-[#8B95A1] hover:text-[#191F28] p-1 rounded-md transition-colors disabled:opacity-50"
                aria-label="수정 취소"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. 링크 제목 입력 */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#333D4B] flex items-center gap-1">
              링크 제목 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('title')}
              placeholder="링크 제목 입력"
              className={`h-9 text-xs ${errors.title ? 'border-red-400 focus:ring-red-400/20' : ''}`}
              autoFocus
            />
            {errors.title && (
              <p className="text-[10px] text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.title.message}
              </p>
            )}
            {/* Quick emoji presets */}
            <div className="flex items-center gap-1 pt-0.5 overflow-x-auto pb-0.5">
              <span className="text-[10px] text-[#8B95A1] shrink-0">이모지:</span>
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="px-1.5 py-0.5 text-[11px] rounded bg-gray-100 hover:bg-gray-200 active:scale-95 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 2. URL 입력 */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#333D4B] flex items-center gap-1">
              연결할 URL <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('url')}
              placeholder="https://github.com/..."
              className={`h-9 text-xs ${errors.url ? 'border-red-400 focus:ring-red-400/20' : ''}`}
            />
            {errors.url && (
              <p className="text-[10px] text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.url.message}
              </p>
            )}
          </div>

          {/* 3. 설명 입력 (선택) */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#333D4B] flex items-center gap-1">
              상세 설명 <span className="text-[#8B95A1] font-normal">(선택)</span>
            </label>
            <Input
              {...register('description')}
              placeholder="설명 입력"
              className={`h-9 text-xs ${errors.description ? 'border-red-400 focus:ring-red-400/20' : ''}`}
            />
            {errors.description && (
              <p className="text-[10px] text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.description.message}
              </p>
            )}
          </div>

          {/* 4. 섹션 설정 */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#333D4B] flex items-center gap-1">
              노출 섹션 <span className="text-red-500">*</span>
            </label>
            {existingSections.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {existingSections.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setValue('section', sec, { shouldValidate: true })}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      sectionValue === sec
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            )}
            <Input
              {...register('section')}
              placeholder="섹션 이름"
              className={`h-9 text-xs mt-1 ${errors.section ? 'border-red-400 focus:ring-red-400/20' : ''}`}
            />
            {errors.section && (
              <p className="text-[10px] text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.section.message}
              </p>
            )}
          </div>

          {/* Footer 버튼: 취소 & 저장하기 */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="text-xs h-8 px-3 rounded-xl cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 rounded-xl cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  저장하기
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  // 2. 일반 뷰: 호버 시 수정/삭제 버튼 노출
  return (
    <Card className="group relative rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md hover:border-gray-200 active:scale-[0.99] transition-all duration-200 cursor-pointer overflow-hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3.5 p-3.5 sm:p-4 w-full text-left"
      >
        {/* Dynamic Platform / Domain Logo */}
        <LinkIcon
          url={link.url}
          title={link.title}
          className="w-11 h-11 group-hover:scale-105 transition-transform duration-200 shrink-0"
          size={22}
        />

        {/* Text Details */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-14 sm:pr-16">
          <span className="text-[15px] font-bold text-[#191F28] leading-snug truncate group-hover:text-blue-600 transition-colors">
            {link.title}
          </span>
          {link.description && (
            <span className="text-[13px] text-[#4E5968] leading-tight line-clamp-1">
              {link.description}
            </span>
          )}
          {updatedTime && (
            <span className="text-[11px] text-[#8B95A1] flex items-center gap-1 font-normal mt-0.5">
              <Clock className="w-2.5 h-2.5" /> {updatedTime}
            </span>
          )}
        </div>

        {/* Chevron arrow (hidden on group hover when action buttons appear) */}
        <div className="p-1.5 rounded-full text-[#B0B8C1] group-hover:opacity-0 transition-opacity shrink-0">
          <ChevronRight className="h-4.5 w-4.5" />
        </div>
      </a>

      {/* ── 호버 표시할 때만 나타나는 수정/삭제 버튼 ── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 z-10 bg-white/95 backdrop-blur-xs pl-1.5 pr-1 py-1 rounded-xl shadow-xs border border-gray-100">
        <button
          type="button"
          onClick={handleStartEdit}
          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          title="수정"
          aria-label="링크 수정"
        >
          <Pencil className="w-4 h-4" />
        </button>
        {onDeleteRequest && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteRequest(link);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="삭제"
            aria-label="링크 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  );
}

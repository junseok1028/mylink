'use client';

import * as React from 'react';
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

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSections: string[];
  onAddLink: (link: Omit<LinkItem, 'id' | 'is_active' | 'display_order'>) => void;
  defaultSection?: string;
}

const EMOJI_PRESETS = ['🚀', '🎨', '📖', '📺', '💬', '💻', '🔗', '⭐'];

export function AddLinkDialog({
  open,
  onOpenChange,
  existingSections,
  onAddLink,
  defaultSection,
}: AddLinkDialogProps) {
  const [title, setTitle] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedSection, setSelectedSection] = React.useState(
    defaultSection || existingSections[0] || '🚀 주요 프로젝트 & 포트폴리오'
  );
  const [customSection, setCustomSection] = React.useState('');
  const [isCustomSection, setIsCustomSection] = React.useState(false);
  const [errors, setErrors] = React.useState<{ title?: string; url?: string }>({});

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setTitle('');
      setUrl('');
      setDescription('');
      setSelectedSection(defaultSection || existingSections[0] || '🚀 주요 프로젝트 & 포트폴리오');
      setCustomSection('');
      setIsCustomSection(false);
      setErrors({});
    }
  }, [open, existingSections, defaultSection]);

  const handleEmojiClick = (emoji: string) => {
    // If title already starts with an emoji, or just prepend
    if (!title.startsWith(emoji)) {
      setTitle((prev) => `${emoji} ${prev.trimStart()}`);
    }
  };

  const validate = () => {
    const newErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      newErrors.title = '링크 제목을 입력해주세요.';
    }

    if (!url.trim()) {
      newErrors.url = '연결할 URL을 입력해주세요.';
    } else {
      const cleanUrl = url.trim().toLowerCase();
      // Basic check for URL validity
      if (
        !cleanUrl.startsWith('http://') &&
        !cleanUrl.startsWith('https://') &&
        !cleanUrl.startsWith('mailto:') &&
        !cleanUrl.includes('.')
      ) {
        newErrors.url = '올바른 웹 주소(URL)를 입력해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) return;

    let finalUrl = url.trim();
    if (
      !finalUrl.startsWith('http://') &&
      !finalUrl.startsWith('https://') &&
      !finalUrl.startsWith('mailto:')
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    const finalSection = isCustomSection
      ? customSection.trim() || '기타'
      : selectedSection;

    onAddLink({
      title: title.trim(),
      url: finalUrl,
      description: description.trim() || undefined,
      section: finalSection,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogClose onClose={() => onOpenChange(false)} />

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

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* 1. 제목 입력 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#333D4B] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#8B95A1]" />
              링크 제목 <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="예: 🎨 마이링크 (MyLink) 서비스"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={errors.title ? 'border-red-400 focus:ring-red-400/20' : ''}
              autoFocus
            />
            {errors.title && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
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
                  className="px-2 py-0.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-transform"
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
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
              }}
              className={errors.url ? 'border-red-400 focus:ring-red-400/20' : ''}
            />
            {errors.url && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.url}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
                    setSelectedSection(sec);
                    setIsCustomSection(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
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
                onClick={() => setIsCustomSection(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isCustomSection
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200/70'
                }`}
              >
                + 새 섹션 입력
              </button>
            </div>

            {isCustomSection && (
              <div className="pt-1 animate-in fade-in">
                <Input
                  placeholder="새 섹션 이름 (예: 💼 경력 & 프로젝트)"
                  value={customSection}
                  onChange={(e) => setCustomSection(e.target.value)}
                  autoFocus
                />
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

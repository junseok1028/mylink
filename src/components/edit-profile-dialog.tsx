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
import { LinkIcon } from '@/components/link-icon';
import { Profile, LinkItem, SocialLinkItem } from '@/lib/types';
import { checkDisplayNameAvailability } from '@/lib/firestore-links';
import {
  SOCIAL_PLATFORMS,
  SocialIcon,
  getPlatformMeta,
  normalizeSocialLinks,
  itemsToSocialsObject,
  formatSocialUrl,
} from '@/components/social-icons';
import { toast } from 'sonner';
import {
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Camera,
  RotateCcw,
  Sparkles,
  Link2,
  AtSign,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Check,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialProfile: Profile;
  initialLinks: LinkItem[];
  fallbackDisplayName?: string;
  fallbackAvatarUrl?: string;
  onSave: (updatedProfile: Profile, updatedLinks: LinkItem[]) => Promise<void>;
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'invalid';

/**
 * 컴퓨터 폴더에서 선택한 이미지 파일을 최대 400px 크기로 리사이징 및 압축하는 헬퍼
 */
function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('이미지 파일(PNG, JPG, WebP 등)만 업로드할 수 있습니다.'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('10MB 이하의 이미지만 업로드 가능합니다.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const dataUrl = canvas.toDataURL('image/webp', 0.88);
          if (dataUrl.startsWith('data:image/webp')) {
            resolve(dataUrl);
            return;
          }
        } catch {
          // fallback to jpeg
        }
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => reject(new Error('이미지를 읽는 중 오류가 발생했습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });
}

export function EditProfileDialog({
  open,
  onOpenChange,
  userId,
  initialProfile,
  initialLinks,
  fallbackDisplayName = '',
  fallbackAvatarUrl = '',
  onSave,
}: EditProfileDialogProps) {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'socials' | 'links'>('profile');
  const [isSaving, setIsSaving] = React.useState(false);

  // 1. 기본 프로필 상태
  const [displayName, setDisplayName] = React.useState(initialProfile.display_name || fallbackDisplayName);
  const [handle, setHandle] = React.useState(initialProfile.handle || '');
  const [bio, setBio] = React.useState(initialProfile.bio || '');
  const [avatarUrl, setAvatarUrl] = React.useState(initialProfile.avatar_url || fallbackAvatarUrl);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);

  // 파일 인풋 ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // 2. 동적 소셜 링크 상태
  const [socialLinks, setSocialLinks] = React.useState<SocialLinkItem[]>([]);

  // 소셜 링크 신규 추가 폼 상태
  const [newPlatform, setNewPlatform] = React.useState<string>('instagram');
  const [newLabel, setNewLabel] = React.useState<string>('Instagram');
  const [newUrl, setNewUrl] = React.useState<string>('');
  const [isAddingSocial, setIsAddingSocial] = React.useState<boolean>(false);

  // 소셜 링크 인라인 수정 상태
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editPlatform, setEditPlatform] = React.useState<string>('instagram');
  const [editLabel, setEditLabel] = React.useState<string>('');
  const [editUrl, setEditUrl] = React.useState<string>('');

  // 3. 링크 노출 관리 상태
  const [links, setLinks] = React.useState<LinkItem[]>(initialLinks);

  // 중복 확인 상태
  const [checkStatus, setCheckStatus] = React.useState<CheckStatus>('idle');
  const [checkMessage, setCheckMessage] = React.useState<string>('');

  // 다이얼로그 열릴 때 초기화
  React.useEffect(() => {
    if (open) {
      const curName = initialProfile.display_name || fallbackDisplayName;
      setDisplayName(curName);
      setHandle(initialProfile.handle || '');
      setBio(initialProfile.bio || '');
      setAvatarUrl(initialProfile.avatar_url || fallbackAvatarUrl);

      // 소셜 링크 초기화: 처음엔 이메일만 있거나 기존 데이터 정규화
      const defaultEmail = initialProfile.socials?.email || '';
      const initialSocials = normalizeSocialLinks(
        initialProfile.socials,
        initialProfile.social_links,
        defaultEmail
      );
      setSocialLinks(initialSocials);

      setLinks(initialLinks);
      setIsAddingSocial(false);
      setEditingId(null);
      setNewUrl('');

      if (curName.trim()) {
        setCheckStatus('available');
        setCheckMessage('현재 사용 중인 표시 이름입니다.');
      } else {
        setCheckStatus('idle');
        setCheckMessage('');
      }
      setActiveTab('profile');
    }
  }, [open, initialProfile, initialLinks, fallbackDisplayName, fallbackAvatarUrl]);

  // 사진 파일 선택 핸들러 (컴퓨터 폴더에서 사진 받기)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const dataUrl = await processImageFile(file);
      setAvatarUrl(dataUrl);
      toast.success('프로필 사진이 적용되었습니다! 📸');
    } catch (err: any) {
      console.error('Photo upload error:', err);
      toast.error(err.message || '사진을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 프로필 사진 삭제
  const handleRemovePhoto = () => {
    setAvatarUrl('');
    toast.info('프로필 사진이 삭제되었습니다 (기본 아바타로 표시)');
  };

  // Google 기본 사진으로 복원
  const handleRestoreFallbackPhoto = () => {
    if (fallbackAvatarUrl) {
      setAvatarUrl(fallbackAvatarUrl);
      toast.info('Google 계정 사진으로 복원되었습니다.');
    }
  };

  // Display Name 변경 감지
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setDisplayName(nextVal);

    const origName = (initialProfile.display_name || fallbackDisplayName).trim();
    if (nextVal.trim() === origName && origName !== '') {
      setCheckStatus('available');
      setCheckMessage('현재 회원님이 사용 중인 이름입니다.');
    } else {
      setCheckStatus('idle');
      setCheckMessage('');
    }
  };

  // 중복 확인 실행
  const performCheck = async (nameToCheck: string): Promise<boolean> => {
    const trimmed = nameToCheck.trim();
    const origName = (initialProfile.display_name || fallbackDisplayName).trim();

    if (trimmed === origName && origName !== '') {
      setCheckStatus('available');
      setCheckMessage('현재 사용 중인 표시 이름입니다.');
      return true;
    }

    setCheckStatus('checking');
    setCheckMessage('중복 여부를 확인하는 중...');

    try {
      const result = await checkDisplayNameAvailability(trimmed, userId);
      if (result.available) {
        setCheckStatus('available');
        setCheckMessage(result.message);
        return true;
      } else {
        setCheckStatus('duplicate');
        setCheckMessage(result.message);
        return false;
      }
    } catch (err) {
      setCheckStatus('invalid');
      setCheckMessage('확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    }
  };

  // 소셜 플랫폼 선택 변경 시 라벨 자동 지정
  const handleNewPlatformSelect = (pId: string) => {
    setNewPlatform(pId);
    const meta = getPlatformMeta(pId);
    setNewLabel(meta.defaultLabel);
  };

  // 소셜 링크 추가
  const handleAddSocial = () => {
    const trimmedUrl = newUrl.trim();
    if (!trimmedUrl) {
      toast.error('링크 주소 또는 이메일을 입력해주세요.');
      return;
    }

    const meta = getPlatformMeta(newPlatform);
    const formattedUrl = formatSocialUrl(newPlatform, trimmedUrl);

    const newItem: SocialLinkItem = {
      id: `sl_${newPlatform}_${Date.now()}`,
      platform: newPlatform,
      label: newLabel.trim() || meta.defaultLabel,
      url: formattedUrl,
    };

    setSocialLinks((prev) => [...prev, newItem]);
    setNewUrl('');
    setIsAddingSocial(false);
    toast.success(`'${newItem.label}' 소셜 링크가 추가되었습니다! ✨`);
  };

  // 소셜 링크 인라인 수정 시작
  const handleStartEditSocial = (item: SocialLinkItem) => {
    setEditingId(item.id);
    setEditPlatform(item.platform);
    setEditLabel(item.label);
    setEditUrl(item.url);
  };

  // 소셜 링크 인라인 수정 완료
  const handleSaveEditSocial = (id: string) => {
    const trimmedUrl = editUrl.trim();
    if (!trimmedUrl) {
      toast.error('링크 주소 또는 이메일을 입력해주세요.');
      return;
    }

    const meta = getPlatformMeta(editPlatform);
    const formattedUrl = formatSocialUrl(editPlatform, trimmedUrl);

    setSocialLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              platform: editPlatform,
              label: editLabel.trim() || meta.defaultLabel,
              url: formattedUrl,
            }
          : item
      )
    );

    setEditingId(null);
    toast.success('소셜 링크가 수정되었습니다.');
  };

  // 소셜 링크 삭제
  const handleDeleteSocial = (id: string, label: string) => {
    setSocialLinks((prev) => prev.filter((item) => item.id !== id));
    toast.success(`'${label}' 소셜 링크가 삭제되었습니다.`);
  };

  // 링크 노출 토글
  const toggleLink = (id: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_active: !item.is_active } : item))
    );
  };

  // 전체 저장 핸들러
  const handleSave = async () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setActiveTab('profile');
      setCheckStatus('invalid');
      setCheckMessage('표시 이름을 입력해주세요.');
      toast.error('표시 이름을 입력해주세요.');
      return;
    }

    if (checkStatus !== 'available') {
      const isOk = await performCheck(trimmedName);
      if (!isOk) {
        setActiveTab('profile');
        toast.error('표시 이름을 확인해주세요.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const updatedSocials = itemsToSocialsObject(socialLinks);

      const updatedProfile: Profile = {
        ...initialProfile,
        username: trimmedName,
        display_name: trimmedName,
        handle: handle.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl.trim(),
        socials: updatedSocials,
        social_links: socialLinks,
      };

      await onSave(updatedProfile, links);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isSaving && onOpenChange(isOpen)}>
      <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col max-h-[92vh]">
        {/* 모달 상단 헤더 */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <DialogHeader className="mb-0">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#191F28]">
              <UserIcon className="w-5 h-5 text-blue-600" />
              마이페이지 프로필 수정
            </DialogTitle>
            <DialogDescription className="text-xs text-[#8B95A1] mt-0.5">
              컴퓨터 사진 등록, 맞춤형 소셜 채널 및 링크 노출을 관리하세요.
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-100 px-6 bg-gray-50/60 text-xs font-semibold text-[#4E5968]">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-[#191F28]'
            }`}
          >
            기본 프로필
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('socials')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'socials'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-[#191F28]'
            }`}
          >
            소셜 링크
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded-full">
              {socialLinks.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'links'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-[#191F28]'
            }`}
          >
            링크 노출 관리
            <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-1.5 py-0.2 rounded-full">
              {links.filter((l) => l.is_active).length}
            </span>
          </button>
        </div>

        {/* 탭 컨텐츠 영역 (스크롤 가능) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-[#191F28]">
          {/* 1. 기본 프로필 탭 */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              {/* 아바타 영역 (컴퓨터 사진 업로드) */}
              <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-100 space-y-3">
                <div className="flex items-center gap-4">
                  {/* 사진 미리보기 및 클릭 시 업로드 */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer shrink-0"
                    title="클릭하여 컴퓨터에서 사진 선택"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="프로필 미리보기"
                        className="w-18 h-18 rounded-full object-cover ring-2 ring-white shadow-sm transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-18 h-18 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
                        {(displayName || 'U').slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-xs border-2 border-white group-hover:bg-blue-700 transition-colors">
                      {isUploadingPhoto ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>

                  {/* 파일 업로드 컨트롤 */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#191F28]">프로필 사진</span>
                      <span className="text-[11px] text-[#8B95A1]">JPG, PNG, WebP</span>
                    </div>

                    {/* 컴퓨터에서 사진 선택 버튼 */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="h-8 px-3 rounded-xl bg-white hover:bg-gray-100 text-[#191F28] border border-gray-200 text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        {isUploadingPhoto ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>컴퓨터에서 사진 선택</span>
                      </Button>

                      {avatarUrl && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={handleRemovePhoto}
                          className="h-8 px-2.5 rounded-xl text-xs text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          사진 삭제
                        </Button>
                      )}
                    </div>

                    {/* 숨겨진 파일 인풋 */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {fallbackAvatarUrl && avatarUrl !== fallbackAvatarUrl && (
                      <button
                        type="button"
                        onClick={handleRestoreFallbackPhoto}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer pt-0.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Google 계정 사진으로 복원
                      </button>
                    )}
                  </div>
                </div>

                {/* URL 직접 입력 보조 옵션 토글 */}
                <div className="pt-1 border-t border-gray-200/70">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#8B95A1] hover:text-[#4E5968] flex items-center gap-1 cursor-pointer"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>웹 이미지 URL로 직접 입력하기</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${showUrlInput ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showUrlInput && (
                    <div className="mt-2 space-y-1 animate-in fade-in-50">
                      <Input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="text-xs h-8 rounded-xl bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 표시 이름 (Display Name) + 중복 확인 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191F28] flex items-center gap-1">
                    표시 이름 (Display Name) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#8B95A1]">2~20자 (공백 제외)</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={displayName}
                      onChange={handleDisplayNameChange}
                      placeholder="표시할 이름을 입력하세요"
                      maxLength={20}
                      className={`h-10 text-xs rounded-xl pr-8 ${
                        checkStatus === 'available'
                          ? 'border-emerald-500 focus-visible:ring-emerald-500/20'
                          : checkStatus === 'duplicate' || checkStatus === 'invalid'
                          ? 'border-red-500 focus-visible:ring-red-500/20'
                          : ''
                      }`}
                    />
                    {checkStatus === 'checking' && (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-2.5 top-3" />
                    )}
                    {checkStatus === 'available' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-2.5 top-3" />
                    )}
                    {(checkStatus === 'duplicate' || checkStatus === 'invalid') && (
                      <AlertCircle className="w-4 h-4 text-red-500 absolute right-2.5 top-3" />
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => performCheck(displayName)}
                    disabled={checkStatus === 'checking' || !displayName.trim()}
                    variant="outline"
                    className="h-10 px-3.5 rounded-xl text-xs font-semibold border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {checkStatus === 'checking' ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> 확인 중
                      </span>
                    ) : (
                      '중복 확인'
                    )}
                  </Button>
                </div>

                {checkMessage && (
                  <div
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                      checkStatus === 'available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : checkStatus === 'duplicate' || checkStatus === 'invalid'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {checkStatus === 'available' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : checkStatus === 'duplicate' || checkStatus === 'invalid' ? (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Info className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="text-[11px] font-medium leading-none">{checkMessage}</span>
                  </div>
                )}
              </div>

              {/* 핸들 (Handle / @아이디) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#191F28] flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5 text-[#8B95A1]" /> 핸들 (Handle / @아이디)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8B95A1]">@</span>
                  <Input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
                    placeholder="myhandle"
                    maxLength={30}
                    className="h-10 text-xs rounded-xl pl-7"
                  />
                </div>
                <p className="text-[11px] text-[#8B95A1] pl-1">
                  프로필 상단 이름 옆 괄호 안에 함께 표시됩니다.
                </p>
              </div>

              {/* 한 줄 소개 (Bio) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191F28] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 한 줄 소개 (Bio)
                  </label>
                  <span className="text-[11px] text-[#8B95A1]">{bio.length}/100</span>
                </div>
                <Input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="방문자들에게 나를 소개하는 멋진 한마디를 적어보세요 🚀"
                  maxLength={100}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>
          )}

          {/* 2. 소셜 링크 탭 (동적 추가, 수정, 삭제) */}
          {activeTab === 'socials' && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#191F28]">내 소셜 링크 관리</h3>
                  <p className="text-[11px] text-[#8B95A1] mt-0.5">
                    원하는 소셜 채널만 자유롭게 추가, 수정, 삭제할 수 있어요.
                  </p>
                </div>
                {!isAddingSocial && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setIsAddingSocial(true);
                      handleNewPlatformSelect('instagram');
                    }}
                    className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> 소셜 링크 추가
                  </Button>
                )}
              </div>

              {/* 새 소셜 링크 추가 폼 */}
              {isAddingSocial && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-blue-600" /> 새 소셜 링크 등록
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingSocial(false)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 플랫폼 선택 */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#4E5968]">플랫폼 선택</label>
                    <select
                      value={newPlatform}
                      onChange={(e) => handleNewPlatformSelect(e.target.value)}
                      className="w-full h-9 text-xs rounded-xl border border-gray-200 bg-white px-3 font-medium text-[#191F28] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 표시 라벨 */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#4E5968]">버튼 이름 (라벨)</label>
                    <Input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="예: Instagram, 개발 블로그 등"
                      className="h-8 text-xs rounded-xl bg-white"
                    />
                  </div>

                  {/* 주소 (URL/Email) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#4E5968]">
                      주소 (URL 또는 이메일)
                    </label>
                    <Input
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder={getPlatformMeta(newPlatform).placeholder}
                      className="h-8 text-xs rounded-xl bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSocial();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingSocial(false)}
                      className="h-7 px-3 text-xs rounded-lg cursor-pointer"
                    >
                      취소
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddSocial}
                      className="h-7 px-3.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-2xs"
                    >
                      추가하기
                    </Button>
                  </div>
                </div>
              )}

              {/* 현재 등록된 소셜 링크 리스트 */}
              <div className="space-y-2.5">
                {socialLinks.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50/80 rounded-2xl border border-gray-100 space-y-2">
                    <Link2 className="w-8 h-8 text-[#8B95A1] mx-auto opacity-60" />
                    <p className="text-xs text-[#4E5968] font-semibold">등록된 소셜 링크가 없습니다.</p>
                    <p className="text-[11px] text-[#8B95A1]">
                      인스타그램, 유튜브, 블로그, 이메일 등 원하는 링크를 추가해보세요.
                    </p>
                    {!isAddingSocial && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setIsAddingSocial(true);
                          handleNewPlatformSelect('instagram');
                        }}
                        className="mt-2 h-8 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> 지금 링크 추가하기
                      </Button>
                    )}
                  </div>
                ) : (
                  socialLinks.map((item) => {
                    const meta = getPlatformMeta(item.platform);
                    const isEditing = editingId === item.id;

                    if (isEditing) {
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5 animate-in fade-in-50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <Pencil className="w-3.5 h-3.5 text-amber-600" /> 소셜 링크 수정
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded-md text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-[#4E5968]">플랫폼</label>
                              <select
                                value={editPlatform}
                                onChange={(e) => setEditPlatform(e.target.value)}
                                className="w-full h-8 text-xs rounded-xl border border-gray-200 bg-white px-2.5 font-medium text-[#191F28]"
                              >
                                {SOCIAL_PLATFORMS.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-[#4E5968]">버튼 이름</label>
                              <Input
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                className="h-8 text-xs rounded-xl bg-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-[#4E5968]">주소</label>
                            <Input
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              className="h-8 text-xs rounded-xl bg-white"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-0.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="h-7 px-3 text-xs rounded-lg cursor-pointer"
                            >
                              취소
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleSaveEditSocial(item.id)}
                              className="h-7 px-3.5 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer shadow-2xs"
                            >
                              수정 완료
                            </Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                          <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-[#191F28] shrink-0 shadow-2xs">
                            <SocialIcon platform={item.platform} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#191F28] truncate">
                                {item.label}
                              </span>
                              <span className="text-[10px] font-medium text-[#8B95A1] bg-gray-200/60 px-1.5 py-0.2 rounded-md">
                                {meta.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8B95A1] truncate block mt-0.5">
                              {item.url}
                            </span>
                          </div>
                        </div>

                        {/* 수정 / 삭제 액션 버튼 */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEditSocial(item)}
                            className="h-7 w-7 p-0 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                            title="수정"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSocial(item.id, item.label)}
                            className="h-7 w-7 p-0 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 3. 링크 노출 관리 탭 */}
          {activeTab === 'links' && (
            <div className="space-y-3 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#8B95A1]">
                  프로필에 공개할 링크를 ON/OFF 토글할 수 있습니다.
                </p>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {links.filter((l) => l.is_active).length}/{links.length}개 노출
                </span>
              </div>

              {links.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8B95A1] bg-gray-50 rounded-2xl">
                  등록된 링크가 없습니다.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {links.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        <LinkIcon
                          url={item.url}
                          title={item.title}
                          className="w-8 h-8 shrink-0 rounded-lg"
                          size={16}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#191F28] truncate">{item.title}</p>
                          <span className="text-[10px] text-[#8B95A1] truncate block mt-0.5">
                            {item.section || '기타'} · {item.url}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={item.is_active ? 'default' : 'outline'}
                        onClick={() => toggleLink(item.id)}
                        className={`text-xs h-7 px-3 rounded-xl transition-all cursor-pointer ${
                          item.is_active
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                            : 'text-[#8B95A1] bg-white border-gray-200 hover:text-[#4E5968]'
                        }`}
                      >
                        {item.is_active ? '노출' : '숨김'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 모달 하단 푸터 액션 */}
        <DialogFooter className="p-4 px-6 border-t border-gray-100 bg-gray-50/40 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs h-9 px-4 cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-9 px-5 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                저장 중...
              </>
            ) : (
              '저장하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

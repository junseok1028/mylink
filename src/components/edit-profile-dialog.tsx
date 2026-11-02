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
import { Profile, LinkItem } from '@/lib/types';
import { checkDisplayNameAvailability } from '@/lib/firestore-links';
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
  Share2,
} from 'lucide-react';

// 소셜 채널 아이콘 렌더링 헬퍼
function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function EmailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

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

  // 폼 내부 상태
  const [displayName, setDisplayName] = React.useState(initialProfile.display_name || fallbackDisplayName);
  const [handle, setHandle] = React.useState(initialProfile.handle || '');
  const [bio, setBio] = React.useState(initialProfile.bio || '');
  const [avatarUrl, setAvatarUrl] = React.useState(initialProfile.avatar_url || fallbackAvatarUrl);

  const [socials, setSocials] = React.useState({
    github: initialProfile.socials?.github || '',
    instagram: initialProfile.socials?.instagram || '',
    youtube: initialProfile.socials?.youtube || '',
    email: initialProfile.socials?.email || '',
    blog: initialProfile.socials?.blog || '',
  });

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
      setSocials({
        github: initialProfile.socials?.github || '',
        instagram: initialProfile.socials?.instagram || '',
        youtube: initialProfile.socials?.youtube || '',
        email: initialProfile.socials?.email || '',
        blog: initialProfile.socials?.blog || '',
      });
      setLinks(initialLinks);

      // 이미 저장되어 있던 자신의 이름은 기본적으로 'available'
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

  const handleManualCheck = () => {
    performCheck(displayName);
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

    // 중복 확인이 아직 완료되지 않은 상태라면 저장 전 즉시 중복 확인 실행
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
      const updatedProfile: Profile = {
        ...initialProfile,
        username: trimmedName,
        display_name: trimmedName,
        handle: handle.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl.trim(),
        socials: {
          github: socials.github.trim() || undefined,
          instagram: socials.instagram.trim() || undefined,
          youtube: socials.youtube.trim() || undefined,
          email: socials.email.trim() || undefined,
          blog: socials.blog.trim() || undefined,
        },
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
      <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 모달 상단 헤더 */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <DialogHeader className="mb-0">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#191F28]">
              <UserIcon className="w-5 h-5 text-blue-600" />
              마이페이지 프로필 수정
            </DialogTitle>
            <DialogDescription className="text-xs text-[#8B95A1] mt-0.5">
              표시 이름(중복 확인), 소개글, 아바타 및 소셜 채널을 관리하세요.
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
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'socials'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-[#191F28]'
            }`}
          >
            소셜 링크
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
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded-full">
              {links.filter((l) => l.is_active).length}
            </span>
          </button>
        </div>

        {/* 탭 컨텐츠 영역 (스크롤 가능) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-[#191F28]">
          {/* 1. 기본 프로필 탭 */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              {/* 아바타 영역 */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="프로필 미리보기"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-xs"
                      onError={() => setAvatarUrl('')}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-xl flex items-center justify-center ring-2 ring-white shadow-xs">
                      {(displayName || 'U').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-2xs border border-gray-200 text-[#4E5968]">
                    <Camera className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-semibold text-[#4E5968] block">아바타 이미지 URL</label>
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="text-xs h-8 rounded-xl bg-white"
                  />
                  {fallbackAvatarUrl && avatarUrl !== fallbackAvatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(fallbackAvatarUrl)}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Google 계정 기본 사진으로 복원
                    </button>
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
                    onClick={handleManualCheck}
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

                {/* 중복 확인 피드백 상태 메시지 */}
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
                {checkStatus === 'idle' && (
                  <p className="text-[11px] text-[#8B95A1] pl-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> 이름을 변경한 경우 우측 [중복 확인] 버튼을 눌러주세요.
                  </p>
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

          {/* 2. 소셜 링크 탭 */}
          {activeTab === 'socials' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <p className="text-xs text-[#8B95A1] leading-relaxed">
                운영 중인 SNS 채널 및 연락처 주소를 입력하면 프로필 상단에 뱃지로 연동됩니다.
              </p>

              {/* GitHub */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4E5968] flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-[#191F28]" /> GitHub 주소
                </label>
                <Input
                  value={socials.github}
                  onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4E5968] flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-600" /> Instagram 주소
                </label>
                <Input
                  value={socials.instagram}
                  onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4E5968] flex items-center gap-1.5">
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-600" /> YouTube 채널
                </label>
                <Input
                  value={socials.youtube}
                  onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                  placeholder="https://youtube.com/@channel"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4E5968] flex items-center gap-1.5">
                  <EmailIcon className="w-3.5 h-3.5 text-blue-500" /> 문의용 이메일 (Email)
                </label>
                <Input
                  value={socials.email}
                  onChange={(e) => setSocials({ ...socials, email: e.target.value })}
                  placeholder="name@example.com"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              {/* Blog / Website */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4E5968] flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" /> 개인 블로그 / 포트폴리오 사이트
                </label>
                <Input
                  value={socials.blog}
                  onChange={(e) => setSocials({ ...socials, blog: e.target.value })}
                  placeholder="https://velog.io/@username"
                  className="text-xs h-9 rounded-xl"
                />
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

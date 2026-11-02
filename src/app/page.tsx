'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Profile, LinkItem } from '@/lib/types';
import { useAuth, getEmailPrefix } from '@/lib/auth-context';
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  deleteLinkFromFirestore,
  updateLinkInFirestore,
  getUserProfileFromFirestore,
  saveUserProfileToFirestore,
  saveUserProfileWithDisplayName,
} from '@/lib/firestore-links';
import {
  getStoredUserProfile,
  saveStoredUserProfile,
  getStoredUserLinks,
  saveStoredUserLinks,
  DEFAULT_PROFILE,
} from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LinkCard } from '@/components/link-card';
import { LinkIcon } from '@/components/link-icon';
import { AddLinkDialog } from '@/components/add-link-dialog';
import { DeleteLinkDialog } from '@/components/delete-link-dialog';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { toast } from 'sonner';
import {
  Share2,
  Settings,
  X,
  Plus,
  PlusCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Link2,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

// React Query hooks for fetching user data
const useUserProfile = (uid?: string) => {
  return useQuery({
    queryKey: ['profile', uid],
    queryFn: () => getUserProfileFromFirestore(uid!),
    enabled: !!uid,
  });
};

const useUserLinks = (uid?: string) => {
  return useQuery({
    queryKey: ['links', uid],
    queryFn: () => getLinksFromFirestore(uid!),
    enabled: !!uid,
  });
};

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GithubIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
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

function EmailIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function InstagramIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Page() {
  const { user, loading: authLoading, displayName, signInWithGoogle, logout } = useAuth();

  // React Query data
  const queryClient = useQueryClient();
  const { data: firestoreProfile, isLoading: profileLoading } = useUserProfile(user?.uid);
  const { data: firestoreLinks, isLoading: linksLoading } = useUserLinks(user?.uid);

  // 로컬 캐시 fallback 포함한 최종 profile/links
  const emailPrefix = user ? getEmailPrefix(user) : '';
  const storedProfile = user ? getStoredUserProfile(user.uid) : null;
  const defaultProfile: Profile = useMemo(
    () => ({
      username: emailPrefix,
      display_name: emailPrefix,
      handle: emailPrefix,
      bio: '나만의 링크와 소개를 작성해보세요 🚀',
      avatar_url: user?.photoURL || '',
      socials: { email: user?.email || '' },
    }),
    [emailPrefix, user?.photoURL, user?.email]
  );

  const profile: Profile = useMemo(() => {
    if (firestoreProfile) {
      return {
        ...defaultProfile,
        ...storedProfile,
        ...firestoreProfile,
        display_name: firestoreProfile.display_name || storedProfile?.display_name || emailPrefix,
        bio: firestoreProfile.bio || storedProfile?.bio || defaultProfile.bio,
        avatar_url: firestoreProfile.avatar_url || user?.photoURL || storedProfile?.avatar_url || '',
        socials: {
          ...defaultProfile.socials,
          ...storedProfile?.socials,
          ...firestoreProfile.socials,
        },
      };
    }
    return storedProfile ?? defaultProfile;
  }, [firestoreProfile, storedProfile, defaultProfile, emailPrefix, user?.photoURL]);

  const links: LinkItem[] = firestoreLinks ?? getStoredUserLinks(user?.uid || '') ?? [];

  // UI state
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dialog & Modal states
  const [isEditing, setIsEditing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogDefaultSection, setDialogDefaultSection] = useState<string>('🚀 주요 프로젝트 & 포트폴리오');

  // 삭제 모달 상태
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
      toast.success('성공적으로 로그인되었습니다! 🎉');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
    } catch (err) {
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };



  // Sonner 기반 내 프로필 링크 복사
  const handleCopyProfileLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('프로필 링크가 복사되었습니다');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profile.display_name || displayName} - 마이링크 프로필`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyProfileLink();
    }
  };

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedProfile: Profile, updatedLinks: LinkItem[]) => {
    if (!user) return;
    setIsSavingProfile(true);
    setIsRefreshing(true);
    const oldName = profile.display_name || displayName;
    // 낙관적 업데이트: 캐시를 즉시 반영
    queryClient.setQueryData(['profile', user.uid], updatedProfile);
    queryClient.setQueryData(['links', user.uid], updatedLinks);
    saveStoredUserProfile(user.uid, updatedProfile);
    saveStoredUserLinks(user.uid, updatedLinks);
    try {
      await saveUserProfileWithDisplayName(user.uid, updatedProfile, oldName);
      // Firestore 링크 노출/숨김 상태 갱신
      for (const link of updatedLinks) {
        await updateLinkInFirestore(user.uid, link.id, { is_active: link.is_active });
      }
      queryClient.invalidateQueries({ queryKey: ['profile', user.uid] });
      queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
      toast.success('프로필과 링크 설정이 저장되었어요! ✨');
      setIsEditing(false);
    } catch (err) {
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: ['profile', user.uid] });
      queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
      console.warn('Firestore profile save error:', err);
      toast.error('저장 중 일부 오류가 발생했습니다.');
    } finally {
      setIsSavingProfile(false);
      setIsRefreshing(false);
    }
  };

  // ── Firestore로 새 링크 추가 (users/{user.uid}/links) ──
  const handleAddNewLink = async (
    newLinkData: Omit<LinkItem, 'id' | 'is_active' | 'display_order'>
  ) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    setIsRefreshing(true);
    try {
      const newItem = await addLinkToFirestore(user.uid, {
        ...newLinkData,
        is_active: true,
        display_order: links.length + 1,
      });
      queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
      toast.success(`'${newItem.title}' 링크가 추가되었어요! ✨`);
    } catch (error) {
      console.error('Firestore link addition error:', error);
      toast.error('링크 추가 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── 개별 링크 수정 (users/{user.uid}/links/{id}) ──
  const handleUpdateLink = async (id: string, updates: Partial<LinkItem>) => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      await updateLinkInFirestore(user.uid, id, updates);
      queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
      toast.success(`'${updates.title || '링크'}' 수정이 반영되었어요!`);
    } catch (error) {
      console.error('Firestore link update error:', error);
      toast.error('수정 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── 개별 링크 삭제 (users/{user.uid}/links/{id}) ──
  const handleConfirmDelete = async (id: string) => {
    if (!user) return;
    const targetTitle = deletingLink?.title || '링크';
    setIsDeleting(true);
    setIsRefreshing(true);
    try {
      await deleteLinkFromFirestore(user.uid, id);
      queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
      toast.success(`'${targetTitle}' 링크가 삭제되었어요.`);
      setDeletingLink(null);
    } catch (error) {
      console.error('Firestore link delete error:', error);
      toast.error('삭제 중 오류가 발생했습니다.');
      setDeletingLink(null);
    } finally {
      setIsDeleting(false);
      setIsRefreshing(false);
    }
  };

  // Group active links by section preserving order
  const activeLinks = useMemo(() => links.filter((l) => l.is_active), [links]);
  const sections = useMemo(
    () => Array.from(new Set(activeLinks.map((l) => l.section || '기타'))),
    [activeLinks]
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl sm:shadow-lg sm:border sm:border-gray-100 flex flex-col overflow-hidden">
        
        {/* ── Top Bar / Header ── */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-5 py-3 flex justify-between items-center transition-all">
          {/* Top Bar 좌측 브랜드 */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              M
            </div>
            <span className="text-[15px] font-bold text-[#191F28] tracking-tight">
              MyLink
            </span>
            {isRefreshing && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse ml-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                동기화 중
              </span>
            )}
          </div>

          {/* Top Bar 우측: 로그인 상태별 액션 */}
          <div className="flex items-center gap-1.5">
            {authLoading ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8B95A1]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>확인 중...</span>
              </div>
            ) : !user ? (
              /* ── 로그아웃 상태 : 'Google로 로그인' 버튼 ── */
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs font-semibold text-[#191F28] active:scale-95 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                aria-label="Google로 로그인"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                ) : (
                  <GoogleIcon className="w-3.5 h-3.5" />
                )}
                <span>Google로 로그인</span>
              </button>
            ) : (
              /* ── 로그인 상태 : 우측 프로필 아바타 + Base UI 드롭다운 메뉴 ── */
              <div className="flex items-center gap-1.5">
                {/* 개인별 페이지 바로 이동 버튼 */}
                <Link
                  href={`/${encodeURIComponent(profile.display_name || displayName)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-all active:scale-95"
                  title="내 개인별 프로필 페이지 보기"
                >
                  <span>내 페이지</span>
                </Link>

                {/* 빠른 공유 버튼 */}
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full text-[#4E5968] hover:text-[#191F28] hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
                  aria-label="프로필 공유하기"
                  title="프로필 링크 복사 및 공유"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* 프로필 드롭다운 메뉴 (설정, 내 프로필 링크 복사, 새 링크 추가, 동기화, 로그아웃 등) */}
                <ProfileDropdown
                  user={user}
                  displayName={displayName}
                  avatarUrl={profile.avatar_url || user.photoURL || undefined}
                  onCopyLink={handleCopyProfileLink}
                  onOpenEdit={handleOpenEdit}
                  onAddLink={() => {
                    setDialogDefaultSection('🚀 주요 프로젝트 & 포트폴리오');
                    setIsAddDialogOpen(true);
                  }}
                  onRefresh={() => {
                    queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
                  }}
                  onLogout={handleLogout}
                  isRefreshing={isRefreshing}
                />
              </div>
            )}
          </div>
        </header>

        {/* ── Refreshing Progress Bar ── */}
        {isRefreshing && (
          <div className="h-0.5 w-full bg-blue-100 overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse w-full" />
          </div>
        )}

        {/* ── 화면 분기: 비로그인 상태 안내 화면 VS 로그인 상태 개인화 화면 ── */}
        {authLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-[#8B95A1] font-medium">인증 정보를 확인하고 있어요...</p>
          </div>
        ) : !user ? (
          /* ── 비로그인 상태 안내 화면 (토스 문구 제거) ── */
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-7 space-y-8 animate-in fade-in duration-300">
            <div className="space-y-6 pt-4 text-center">
              {/* 심플한 원형 아이콘 */}
              <div className="mx-auto w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Link2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              {/* 메인 타이틀 & 설명 문구 */}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> 나만의 링크 모음 서비스
                </span>
                <h1 className="text-2xl font-bold text-[#191F28] tracking-tight leading-snug">
                  나만의 링크를<br />하나의 프로필에 모아보세요
                </h1>
                <p className="text-sm text-[#4E5968] leading-relaxed break-keep px-2">
                  포트폴리오, 소셜 채널, 블로그까지!<br />
                  Google 로그인 후 나만의 링크를 등록하고 관리할 수 있어요.
                </p>
              </div>

              {/* 기능 소개 안내 카드 리스트 */}
              <div className="space-y-2.5 text-left pt-2">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white text-blue-600 shadow-2xs shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#191F28]">깔끔하고 세련된 바이오 링크</h2>
                    <p className="text-[11px] text-[#8B95A1] mt-0.5 leading-normal">
                      모바일과 웹 어디서나 보기 좋은 모던한 카드형 UI를 제공해요.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white text-blue-600 shadow-2xs shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#191F28]">안전한 클라우드 개인화</h2>
                    <p className="text-[11px] text-[#8B95A1] mt-0.5 leading-normal">
                      나의 Google 계정 공간에 저장되어 실시간으로 안전하게 동기화돼요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 비로그인 하단 CTA 버튼 */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl text-sm font-bold text-[#191F28] shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <GoogleIcon className="w-4 h-4" />
                )}
                <span>Google 계정으로 시작하기</span>
              </button>
              <p className="text-[11px] text-center text-[#8B95A1]">
                로그인하면 나만의 링크를 바로 등록할 수 있어요.
              </p>
            </div>
          </div>
        ) : (
          /* ── 로그인 상태 : 개인화된 화면 (users/{user.uid}/links) ── */
          <>
            {/* ── Profile Section: Avatar, Name & Handle, Bio, Social Badges ── */}
            <section className="flex flex-col items-center text-center px-5 pt-7 pb-4 space-y-3">
              {/* Avatar (80x80 Round Card) */}
              <div
                onClick={handleOpenEdit}
                className="relative group cursor-pointer"
                title="프로필 수정하기"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-50 shadow-sm transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center ring-4 ring-gray-50 shadow-sm transition-transform group-hover:scale-105">
                    {displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
                  수정
                </div>
              </div>

              {/* Name & Handle (display name) */}
              <div>
                <h1 className="text-[20px] font-bold text-[#191F28] leading-tight">
                  {profile.display_name || displayName}
                  {profile.handle && (
                    <span className="text-[15px] font-normal text-[#8B95A1] ml-1.5">
                      ({profile.handle.startsWith('@') ? profile.handle : `@${profile.handle}`})
                    </span>
                  )}
                </h1>
                <p className="text-[14px] text-[#4E5968] mt-1.5 font-medium px-4">
                  &quot;{profile.bio || '나만의 링크를 한곳에서 관리해보세요 🚀'}&quot;
                </p>
              </div>

              {/* Social Badges: GitHub + Instagram + YouTube + Email + Blog */}
              {(profile.socials.github ||
                profile.socials.instagram ||
                profile.socials.youtube ||
                profile.socials.blog ||
                profile.socials.email ||
                user.email) && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {profile.socials.github && (
                    <a
                      href={
                        profile.socials.github.startsWith('http')
                          ? profile.socials.github
                          : `https://${profile.socials.github}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/80 active:scale-95 text-xs font-semibold text-[#333D4B] transition-all"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.socials.instagram && (
                    <a
                      href={
                        profile.socials.instagram.startsWith('http')
                          ? profile.socials.instagram
                          : `https://${profile.socials.instagram}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100/80 text-pink-700 active:scale-95 text-xs font-semibold transition-all"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {profile.socials.youtube && (
                    <a
                      href={
                        profile.socials.youtube.startsWith('http')
                          ? profile.socials.youtube
                          : `https://${profile.socials.youtube}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100/80 text-red-700 active:scale-95 text-xs font-semibold transition-all"
                    >
                      <YoutubeIcon className="w-3.5 h-3.5" />
                      <span>YouTube</span>
                    </a>
                  )}
                  {profile.socials.blog && (
                    <a
                      href={
                        profile.socials.blog.startsWith('http')
                          ? profile.socials.blog
                          : `https://${profile.socials.blog}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 active:scale-95 text-xs font-semibold transition-all"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Blog</span>
                    </a>
                  )}
                  {(profile.socials.email || user.email) && (
                    <button
                      onClick={() => setIsEmailModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/80 active:scale-95 text-xs font-semibold text-[#333D4B] transition-all cursor-pointer"
                    >
                      <EmailIcon className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* ── Link Sections: Section Header + Link Button Cards ── */}
            <main className="flex-1 px-5 py-3 space-y-6">
              {/* 로딩 스켈레톤 */}
              {isLoadingLinks ? (
                <div className="space-y-4 py-1">
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-gray-200/80 rounded-md animate-pulse ml-1" />
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-xs animate-pulse"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gray-200/70 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-2/5 bg-gray-200/80 rounded" />
                          <div className="h-3 w-4/5 bg-gray-100 rounded" />
                        </div>
                        <div className="w-4 h-4 bg-gray-200/50 rounded-full shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeLinks.length > 0 ? (
                <>
                  {sections.map((section) => (
                    <div key={section} className="space-y-2.5">
                      {/* Section Header */}
                      <h2 className="text-[14px] font-bold text-[#191F28] px-1 tracking-tight">
                        {section}
                      </h2>

                      {/* Link Cards */}
                      <div className="space-y-2.5">
                        {activeLinks
                          .filter((l) => (l.section || '기타') === section)
                          .map((link) => (
                            <LinkCard
                              key={link.id}
                              link={link}
                              existingSections={sections}
                              onUpdate={handleUpdateLink}
                              onDeleteRequest={(item) => setDeletingLink(item)}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                /* ── 링크가 없을 때 Empty State ── */
                <div className="py-12 px-6 text-center space-y-4 bg-gray-50/80 border border-gray-100 rounded-3xl">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-[#191F28]">아직 등록된 링크가 없어요</h2>
                    <p className="text-xs text-[#8B95A1] leading-relaxed break-keep">
                      나만의 첫 번째 링크를 등록하고 프로필을 완성해보세요!
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setDialogDefaultSection('🚀 주요 프로젝트 & 포트폴리오');
                      setIsAddDialogOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs px-4 py-2 font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />첫 링크 추가하기
                  </Button>
                </div>
              )}

              {/* ── 링크 추가 CTA 버튼 ── */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setDialogDefaultSection('🚀 주요 프로젝트 & 포트폴리오');
                    setIsAddDialogOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 rounded-2xl text-xs font-semibold text-blue-600 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  프로젝트 링크 추가
                </button>
                <button
                  onClick={() => {
                    setDialogDefaultSection('📢 소셜 채널');
                    setIsAddDialogOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  소셜 채널 추가
                </button>
              </div>
            </main>
          </>
        )}

        {/* ── Footer: Powered by MyLink ── */}
        <footer className="text-center py-6 border-t border-gray-50 mt-auto">
          <p className="text-xs text-[#8B95A1]">
            Powered by <span className="text-[#3182F6] font-semibold">MyLink</span>
          </p>
        </footer>
      </div>

      {/* ── Email Copy Modal ── */}
      {isEmailModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsEmailModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#191F28]">이메일 주소</h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
              <EmailIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-[#191F28] flex-1 break-all">
                {profile.socials.email || user?.email}
              </span>
            </div>
            <button
              onClick={() => {
                const targetEmail = profile.socials.email || user?.email || '';
                navigator.clipboard.writeText(targetEmail);
                toast.success('이메일 주소가 복사되었습니다');
                setIsEmailModalOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#3182F6] text-white text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
            >
              복사하기
            </button>
          </div>
        </div>
      )}

      {/* ── Edit Profile Dialog ── */}
      {user && (
        <EditProfileDialog
          open={isEditing}
          onOpenChange={setIsEditing}
          userId={user.uid}
          initialProfile={profile}
          initialLinks={links}
          fallbackDisplayName={displayName}
          fallbackAvatarUrl={user.photoURL || ''}
          onSave={handleSaveProfile}
        />
      )}

      {/* ── Add Link Dialog ── */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        existingSections={
          sections.length > 0 ? sections : ['🚀 주요 프로젝트 & 포트폴리오', '📢 소셜 채널']
        }
        defaultSection={dialogDefaultSection}
        onAddLink={handleAddNewLink}
      />

      {/* ── Delete Link Confirmation Dialog ── */}
      <DeleteLinkDialog
        open={Boolean(deletingLink)}
        onOpenChange={(open) => {
          if (!open) setDeletingLink(null);
        }}
        link={deletingLink}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

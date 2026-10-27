'use client';

import { useState, useEffect, useCallback } from 'react';
import { Profile, LinkItem } from '@/lib/types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredLinks,
  saveStoredLinks,
  INITIAL_PROFILE,
  INITIAL_LINKS,
} from '@/lib/storage';
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  deleteLinkFromFirestore,
  updateLinkInFirestore,
  seedInitialLinksIfEmpty,
  getProfileFromFirestore,
  saveProfileToFirestore,
} from '@/lib/firestore-links';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LinkCard } from '@/components/link-card';
import { LinkIcon } from '@/components/link-icon';
import { AddLinkDialog } from '@/components/add-link-dialog';
import { DeleteLinkDialog } from '@/components/delete-link-dialog';
import { Share2, Settings, X, Plus, Trash2, PlusCircle, Loader2, RefreshCw, Globe } from 'lucide-react';

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function EmailIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function WebGlobeIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export default function Page() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogDefaultSection, setDialogDefaultSection] = useState<string>('🚀 주요 프로젝트 & 포트폴리오');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 삭제 모달 상태
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Edit form state
  const [editProfile, setEditProfile] = useState<Profile>(INITIAL_PROFILE);
  const [editLinks, setEditLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSection, setNewSection] = useState('🚀 주요 프로젝트 & 포트폴리오');
  // ---- New state for dynamic social addition ----
  const [newSocialType, setNewSocialType] = useState<'' | 'github' | 'instagram' | 'youtube' | 'email'>('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  // Email copy modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  /**
   * Firestore에서 링크 목록을 1회 불러옵니다 (createAt 최신순 정렬)
   */
  const loadLinksFromFirestore = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      // 1. Firestore에서 링크 목록 가져오기 (createAt desc 정렬)
      let firestoreLinks = await getLinksFromFirestore();

      // 만약 첫 방문이라 Firestore가 비어있다면 초기 데이터 시딩 후 재조회
      if (firestoreLinks.length === 0) {
        await seedInitialLinksIfEmpty();
        firestoreLinks = await getLinksFromFirestore();
      }

      if (firestoreLinks.length > 0) {
        setLinks(firestoreLinks);
        saveStoredLinks(firestoreLinks);
        setEditLinks(firestoreLinks);
      }
    } catch (err) {
      console.error('Firestore getLinks error:', err);
      showToast('네트워크 문제로 로컬 캐시 링크를 불러왔어요.');
    } finally {
      if (isInitial) {
        setIsLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  // 페이지 마운트 시 1회 Firestore에서 링크 및 프로필 불러오기
  useEffect(() => {
    // 1. 프로필 및 로컬 캐시 링크 즉시 표시
    setProfile(getStoredProfile());
    const cachedLinks = getStoredLinks();
    if (cachedLinks && cachedLinks.length > 0) {
      setLinks(cachedLinks);
    }

    // Firestore 원격 프로필 조회 및 동기화
    getProfileFromFirestore().then((remoteProfile) => {
      if (remoteProfile) {
        setProfile(remoteProfile);
        saveStoredProfile(remoteProfile);
      }
    });

    // 2. Firestore에서 최신순 링크 불러오기
    loadLinksFromFirestore(true);
  }, [loadLinksFromFirestore]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.display_name} - 마이링크 프로필`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('프로필 링크가 복사되었어요!');
    }
  };

  const handleOpenEdit = () => {
    setEditProfile({
      ...profile,
      socials: { ...profile.socials },
    });
    setEditLinks([...links]);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSavingProfile(true);
    setIsRefreshing(true);
    try {
      setProfile(editProfile);
      saveStoredProfile(editProfile);
      await saveProfileToFirestore(editProfile);

      setLinks(editLinks);
      saveStoredLinks(editLinks);

      // Firestore 링크 노출/숨김 상태 갱신
      for (const link of editLinks) {
        await updateLinkInFirestore(link.id, {
          is_active: link.is_active,
        });
      }
      await loadLinksFromFirestore(false);
      showToast('저장 완료! 프로필과 노출 설정이 저장되었어요.');
      setIsEditing(false);
    } catch (err) {
      console.warn('Firestore update sync error:', err);
      showToast('프로필이 업데이트되었어요.');
      setIsEditing(false);
    } finally {
      setIsSavingProfile(false);
      setIsRefreshing(false);
    }
  };

  // ── Firestore로 링크 추가 후 목록 갱신 (users/anonymous/links) ──
  const handleAddNewLink = async (
    newLinkData: Omit<LinkItem, 'id' | 'is_active' | 'display_order'>
  ) => {
    setIsRefreshing(true);
    try {
      const newItem = await addLinkToFirestore({
        ...newLinkData,
        is_active: true,
        display_order: links.length + 1,
      });

      // Firestore에서 최신순 목록 다시 불러와 목록 갱신!
      await loadLinksFromFirestore(false);

      showToast(`'${newItem.title}' 링크가 추가되었어요! ✨`);
    } catch (error) {
      console.error('Firestore link addition error:', error);
      // 로컬 스토리지 Fallback 처리
      const fallbackItem: LinkItem = {
        id: `link_${Date.now()}`,
        ...newLinkData,
        is_active: true,
        display_order: links.length + 1,
        createAt: Date.now(),
      };
      const updated = [fallbackItem, ...links];
      setLinks(updated);
      saveStoredLinks(updated);
      setEditLinks(updated);
      showToast(`'${fallbackItem.title}' 링크가 로컬에 추가되었어요.`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setIsRefreshing(true);
    try {
      const newItem = await addLinkToFirestore({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        url: newUrl.trim(),
        section: newSection.trim() || '기타',
        is_active: true,
        display_order: editLinks.length + 1,
      });

      setNewTitle('');
      setNewDescription('');
      setNewUrl('');

      // 목록 갱신
      await loadLinksFromFirestore(false);
      showToast(`'${newItem.title}' 링크가 추가되었어요! ✨`);
    } catch (error) {
      console.error('Firestore link addition error:', error);
      const fallbackItem: LinkItem = {
        id: `link_${Date.now()}`,
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        url: newUrl.trim(),
        section: newSection.trim() || '기타',
        is_active: true,
        display_order: editLinks.length + 1,
        createAt: Date.now(),
      };
      setEditLinks([fallbackItem, ...editLinks]);
      setNewTitle('');
      setNewDescription('');
      setNewUrl('');
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── 개별 링크 인라인 수정 후 Firestore 갱신형 업데이트 ──
  const handleUpdateLink = async (id: string, updates: Partial<LinkItem>) => {
    setIsRefreshing(true);
    try {
      await updateLinkInFirestore(id, updates);
      // 갱신형: Firestore에서 최신 목록 다시 불러오기
      await loadLinksFromFirestore(false);
      showToast(`'${updates.title || '링크'}' 수정이 반영되었어요! ✨`);
    } catch (error) {
      console.error('Firestore link update error:', error);
      // 로컬 스토리지 Fallback
      const updated = links.map((l) => (l.id === id ? { ...l, ...updates } : l));
      setLinks(updated);
      saveStoredLinks(updated);
      setEditLinks(updated);
      showToast('로컬에 수정 사항이 반영되었어요.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── 개별 링크 삭제 확인 후 Firestore 갱신형 삭제 ──
  const handleConfirmDelete = async (id: string) => {
    const targetTitle = deletingLink?.title || '링크';
    setIsDeleting(true);
    setIsRefreshing(true);
    try {
      await deleteLinkFromFirestore(id);
      // 갱신형: Firestore에서 최신 목록 다시 불러오기
      await loadLinksFromFirestore(false);
      showToast(`'${targetTitle}' 링크가 삭제되었어요.`);
      setDeletingLink(null);
    } catch (error) {
      console.error('Firestore link delete error:', error);
      // 로컬 스토리지 Fallback
      const updated = links.filter((l) => l.id !== id);
      setLinks(updated);
      saveStoredLinks(updated);
      setEditLinks(updated);
      showToast('링크가 삭제되었어요.');
      setDeletingLink(null);
    } finally {
      setIsDeleting(false);
      setIsRefreshing(false);
    }
  };

  const toggleLinkActive = (id: string) => {
    setEditLinks(editLinks.map(l => l.id === id ? { ...l, is_active: !l.is_active } : l));
  };

  const deleteLink = async (id: string) => {
    setEditLinks(editLinks.filter(l => l.id !== id));
    setIsRefreshing(true);
    try {
      await deleteLinkFromFirestore(id);
      await loadLinksFromFirestore(false);
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setEditLinks(editLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // Group active links by section preserving order
  const activeLinks = links.filter(l => l.is_active);
  const sections = Array.from(new Set(activeLinks.map(l => l.section || '기타')));

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl sm:shadow-lg sm:border sm:border-gray-100 flex flex-col overflow-hidden">
        
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 min-h-[28px]">
            {isRefreshing && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                갱신 중
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => loadLinksFromFirestore(false)}
              disabled={isRefreshing || isLoading}
              className="p-2 rounded-full text-[#4E5968] hover:text-blue-600 hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
              aria-label="새로고침"
              title="Firestore 링크 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <Button
              size="sm"
              onClick={() => {
                setDialogDefaultSection('🚀 주요 프로젝트 & 포트폴리오');
                setIsAddDialogOpen(true);
              }}
              className="h-8 px-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs active:scale-95 transition-all"
              title="새 링크 추가 다이얼로그 열기"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              링크 추가
            </Button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-[#4E5968] hover:text-[#191F28] hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="공유"
              title="프로필 공유하기"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenEdit}
              className="h-8 px-2.5 text-xs text-[#4E5968] hover:text-[#191F28] font-medium"
            >
              <Settings className="w-3.5 h-3.5 mr-1" />
              편집
            </Button>
          </div>
        </header>

        {/* ── Refreshing Progress Bar ── */}
        {isRefreshing && (
          <div className="h-0.5 w-full bg-blue-100 overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse w-full" />
          </div>
        )}

        {/* ── Profile Section: Avatar, Name & Handle, Bio, Social Badges ── */}
        <section className="flex flex-col items-center text-center px-5 pt-7 pb-4 space-y-3">
          {/* Avatar (80x80 Round Card) */}
          <div className="relative">
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-50 shadow-sm"
            />
          </div>

          {/* Name & Handle */}
          <div>
            <h1 className="text-[20px] font-bold text-[#191F28] leading-tight">
              {profile.display_name}
              {profile.handle && (
                <span className="text-[15px] font-normal text-[#8B95A1] ml-1.5">
                  ({profile.handle})
                </span>
              )}
            </h1>
            <p className="text-[14px] text-[#4E5968] mt-1.5 font-medium">
              &quot;{profile.bio}&quot;
            </p>
          </div>

          {/* Social Badges: GitHub + Email only */}
          {(profile.socials.github || profile.socials.email) && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {profile.socials.github && (
                <a
                  href={profile.socials.github.startsWith('http') ? profile.socials.github : `https://${profile.socials.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/80 active:scale-95 text-xs font-semibold text-[#333D4B] transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.socials.email && (
                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/80 active:scale-95 text-xs font-semibold text-[#333D4B] transition-all"
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
          {/* 초기 로딩 시 스켈레톤 UI */}
          {isLoading ? (
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
          ) : (
            <>
              {sections.map(section => (
                <div key={section} className="space-y-2.5">
                  {/* Section Header */}
                  <h2 className="text-[14px] font-bold text-[#191F28] px-1 tracking-tight">
                    {section}
                  </h2>

                  {/* Link Cards */}
                  <div className="space-y-2.5">
                    {activeLinks
                      .filter(l => (l.section || '기타') === section)
                      .map(link => (
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

              {activeLinks.length === 0 && (
                <div className="p-8 text-center text-sm text-[#8B95A1] bg-gray-50 rounded-2xl">
                  표시할 링크가 없습니다. 아래 버튼을 눌러 추가해보세요.
                </div>
              )}
            </>
          )}

          {/* ── 링크 추가 CTA 버튼 ── */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                setDialogDefaultSection('🚀 주요 프로젝트 & 포트폴리오');
                setIsAddDialogOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 rounded-2xl text-xs font-semibold text-blue-600 active:scale-[0.98] transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              프로젝트 링크 추가
            </button>
            <button
              onClick={() => {
                setDialogDefaultSection('📢 소셜 채널');
                setIsAddDialogOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold active:scale-[0.98] transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              소셜 채널 추가
            </button>
          </div>
        </main>

        {/* ── Footer: Powered by MyLink · 토스 스타일 ── */}
        <footer className="text-center py-6 border-t border-gray-50 mt-auto">
          <p className="text-xs text-[#8B95A1]">
            Powered by <span className="text-[#3182F6] font-semibold">MyLink</span> · 토스 스타일
          </p>
        </footer>
      </div>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#191F28] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

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
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
              <EmailIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm font-medium text-[#191F28] flex-1 break-all">
                {profile.socials.email}
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(profile.socials.email ?? '');
                showToast('이메일 주소가 복사되었습니다 ✓');
                setIsEmailModalOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#3182F6] text-white text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all"
            >
              복사하기
            </button>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-5 rounded-3xl bg-white shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#191F28]">프로필 및 설정</h2>
              <button
                disabled={isSavingProfile}
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. 프로필 기본 정보 */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#8B95A1] uppercase tracking-wider">
                프로필 정보
              </h3>
              <div>
                <label className="text-xs font-semibold text-[#4E5968] mb-1 block">이름</label>
                <Input
                  value={editProfile.display_name}
                  onChange={e => setEditProfile({ ...editProfile, display_name: e.target.value })}
                  placeholder="안준석"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4E5968] mb-1 block">핸들 (Handle)</label>
                <Input
                  value={editProfile.handle || ''}
                  onChange={e => setEditProfile({ ...editProfile, handle: e.target.value })}
                  placeholder="Junseok"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4E5968] mb-1 block">한 줄 소개</label>
                <Input
                  value={editProfile.bio}
                  onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                  placeholder="풀스택 개발자 & 크리에이터 🚀"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 2. 소셜 링크 설정 (GitHub, Email 2개만) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#8B95A1] uppercase tracking-wider">소셜 링크</h3>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-[#4E5968] flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub URL
                </label>
                <Input
                  value={editProfile.socials.github ?? ''}
                  onChange={(e) =>
                    setEditProfile((p) => ({
                      ...p,
                      socials: { ...p.socials, github: e.target.value },
                    }))
                  }
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-[#4E5968] flex items-center gap-1.5">
                  <EmailIcon className="w-3.5 h-3.5" /> 이메일 (Email)
                </label>
                <Input
                  value={editProfile.socials.email ?? ''}
                  onChange={(e) =>
                    setEditProfile((p) => ({
                      ...p,
                      socials: { ...p.socials, email: e.target.value },
                    }))
                  }
                  placeholder="example@domain.com"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 3. 링크 노출/숨김 관리 (중복 수정/추가 제거하고 토글만 심플하게 유지) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#8B95A1] uppercase tracking-wider">
                  링크 노출 관리
                </h3>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {editLinks.filter(l => l.is_active).length}/{editLinks.length}개 노출
                </span>
              </div>
              <p className="text-[11px] text-[#8B95A1]">
                버튼을 눌러 각 링크를 프로필에서 바로 노출하거나 숨길 수 있습니다.
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {editLinks.map(link => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <LinkIcon
                        url={link.url}
                        title={link.title}
                        className="w-8 h-8 shrink-0 rounded-lg"
                        size={16}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#191F28] truncate">{link.title}</p>
                        <span className="text-[10px] text-[#8B95A1] truncate block mt-0.5">
                          {link.section || '기타'}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={link.is_active ? 'default' : 'outline'}
                      onClick={() => toggleLinkActive(link.id)}
                      className={`text-xs h-7 px-3 rounded-xl transition-all cursor-pointer ${
                        link.is_active
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          : 'text-[#8B95A1] bg-white border-gray-200 hover:text-[#4E5968]'
                      }`}
                    >
                      {link.is_active ? '노출' : '숨김'}
                    </Button>
                  </div>
                ))}
              </div>

              {/* 안내 문구 */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-700 flex items-start gap-1.5 leading-relaxed">
                <span>💡</span>
                <span>
                  링크 내용 수정은 메인 링크 카드의 <strong>연필(수정)</strong> 아이콘을, 새 링크 추가는 <strong>[링크 추가]</strong> 버튼을 이용해주세요.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                disabled={isSavingProfile}
                onClick={() => setIsEditing(false)}
                className="rounded-xl cursor-pointer"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSavingProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  '저장하기'
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Add Link Dialog ── */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        existingSections={sections.length > 0 ? sections : ['🚀 주요 프로젝트 & 포트폴리오', '📢 소셜 채널']}
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

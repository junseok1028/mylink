'use client';

import { useState, useEffect } from 'react';
import { Profile, LinkItem } from '@/lib/types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredLinks,
  saveStoredLinks,
  INITIAL_PROFILE,
  INITIAL_LINKS,
} from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LinkCard } from '@/components/link-card';
import { AddLinkDialog } from '@/components/add-link-dialog';
import { Share2, Settings, X, Plus, Trash2, PlusCircle } from 'lucide-react';

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

export default function Page() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogDefaultSection, setDialogDefaultSection] = useState<string>('🚀 주요 프로젝트 & 포트폴리오');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editProfile, setEditProfile] = useState<Profile>(INITIAL_PROFILE);
  const [editLinks, setEditLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSection, setNewSection] = useState('🚀 주요 프로젝트 & 포트폴리오');

  useEffect(() => {
    setProfile(getStoredProfile());
    setLinks(getStoredLinks());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

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
    setEditProfile({ ...profile });
    setEditLinks([...links]);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editProfile);
    saveStoredProfile(editProfile);
    setLinks(editLinks);
    saveStoredLinks(editLinks);
    setIsEditing(false);
    showToast('저장 완료! 프로필이 업데이트되었어요.');
  };

  const handleAddNewLink = (
    newLinkData: Omit<LinkItem, 'id' | 'is_active' | 'display_order'>
  ) => {
    const newItem: LinkItem = {
      id: `link_${Date.now()}`,
      ...newLinkData,
      is_active: true,
      display_order: links.length + 1,
    };
    const updated = [...links, newItem];
    setLinks(updated);
    saveStoredLinks(updated);
    // Also sync with editLinks if editor was open
    setEditLinks(updated);
    showToast(`'${newItem.title}' 링크가 추가되었어요! ✨`);
  };

  const handleAddLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const newItem: LinkItem = {
      id: `link_${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      url: newUrl.trim(),
      section: newSection.trim() || '기타',
      is_active: true,
      display_order: editLinks.length + 1,
    };
    setEditLinks([...editLinks, newItem]);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
  };

  const toggleLinkActive = (id: string) => {
    setEditLinks(editLinks.map(l => l.id === id ? { ...l, is_active: !l.is_active } : l));
  };

  const deleteLink = (id: string) => {
    setEditLinks(editLinks.filter(l => l.id !== id));
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
        
        {/* ── Top Bar: [토스 프로필]  [ ↗ ] (공유 버튼) ── */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-3.5 flex justify-between items-center">
          <span className="text-[14px] font-bold text-[#191F28] tracking-tight">
            토스 프로필
          </span>
          <div className="flex items-center gap-1.5">
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

          {/* Social Badges (Pill Buttons: GitHub, Insta, Email) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {profile.socials.github && (
              <a
                href={profile.socials.github}
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
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/80 active:scale-95 text-xs font-semibold text-[#333D4B] transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Insta</span>
              </a>
            )}

            {profile.socials.email && (
              <a
                href={profile.socials.email.startsWith('mailto:') ? profile.socials.email : `mailto:${profile.socials.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/80 active:scale-95 text-xs font-semibold text-[#333D4B] transition-all"
              >
                <EmailIcon className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>
            )}
          </div>
        </section>

        {/* ── Link Sections: Section Header + Link Button Cards ── */}
        <main className="flex-1 px-5 py-3 space-y-6">
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
                    <LinkCard key={link.id} link={link} />
                  ))}
              </div>
            </div>
          ))}

          {activeLinks.length === 0 && (
            <div className="p-8 text-center text-sm text-[#8B95A1] bg-gray-50 rounded-2xl">
              표시할 링크가 없습니다. 아래 버튼을 눌러 추가해보세요.
            </div>
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

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-5 rounded-3xl bg-white shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#191F28]">프로필 및 링크 편집</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile fields */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#8B95A1] uppercase tracking-wider">프로필</h3>
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
              <div>
                <label className="text-xs font-semibold text-[#4E5968] mb-1 block">GitHub URL</label>
                <Input
                  value={editProfile.socials.github || ''}
                  onChange={e => setEditProfile({ ...editProfile, socials: { ...editProfile.socials, github: e.target.value } })}
                  placeholder="https://github.com/junseok1028/mylink"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Links management */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#8B95A1] uppercase tracking-wider">링크 관리</h3>
              {editLinks.map(link => (
                <div key={link.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={link.title}
                      onChange={e => updateLink(link.id, 'title', e.target.value)}
                      placeholder="제목"
                      className="flex-1 bg-white text-xs font-bold"
                    />
                    <Button
                      size="sm"
                      variant={link.is_active ? 'default' : 'outline'}
                      onClick={() => toggleLinkActive(link.id)}
                      className="text-xs shrink-0"
                    >
                      {link.is_active ? '노출' : '숨김'}
                    </Button>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Input
                    value={link.description || ''}
                    onChange={e => updateLink(link.id, 'description', e.target.value)}
                    placeholder="설명"
                    className="bg-white text-xs"
                  />
                  <Input
                    value={link.url}
                    onChange={e => updateLink(link.id, 'url', e.target.value)}
                    placeholder="https://..."
                    className="bg-white text-xs"
                  />
                  <Input
                    value={link.section || ''}
                    onChange={e => updateLink(link.id, 'section', e.target.value)}
                    placeholder="섹션 이름"
                    className="bg-white text-xs"
                  />
                </div>
              ))}

              {/* Add Link */}
              <div className="p-3 border border-dashed border-gray-200 rounded-2xl space-y-2 bg-white">
                <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> 새 링크 추가
                </p>
                <Input
                  placeholder="제목"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
                <Input
                  placeholder="설명"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                />
                <Input
                  placeholder="URL"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                />
                <Input
                  placeholder="섹션 (예: 🚀 주요 프로젝트 & 포트폴리오)"
                  value={newSection}
                  onChange={e => setNewSection(e.target.value)}
                />
                <Button size="sm" onClick={handleAddLink} className="w-full text-xs">
                  추가하기
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                취소
              </Button>
              <Button onClick={handleSave}>
                저장하기
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
    </div>
  );
}

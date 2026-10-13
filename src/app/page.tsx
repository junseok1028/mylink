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
import { Share2, Mail, X } from 'lucide-react';

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

export default function Page() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [isEditing, setIsEditing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Edit form state
  const [editProfile, setEditProfile] = useState<Profile>(INITIAL_PROFILE);
  const [editLinks, setEditLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSection, setNewSection] = useState('');

  useEffect(() => {
    setProfile(getStoredProfile());
    setLinks(getStoredLinks());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: profile.display_name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('링크가 복사되었습니다.');
    }
  };

  const handleOpenEditor = () => {
    setEditProfile({ ...profile });
    setEditLinks([...links]);
    setIsEditing(true);
  };

  const handleSaveAll = () => {
    setProfile(editProfile);
    saveStoredProfile(editProfile);
    setLinks(editLinks);
    saveStoredLinks(editLinks);
    setIsEditing(false);
    showToast('변경사항이 저장되었습니다.');
  };

  const handleAddLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const newItem: LinkItem = {
      id: `link_${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      url: newUrl.trim(),
      section: newSection.trim() || undefined,
      is_active: true,
      display_order: editLinks.length + 1,
    };
    setEditLinks([...editLinks, newItem]);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    setNewSection('');
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

  // Group active links by section
  const activeLinks = links.filter(l => l.is_active);
  const sections = Array.from(new Set(activeLinks.map(l => l.section || '기타')));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center max-w-xl mx-auto">
        <span className="text-sm font-semibold text-gray-800">토스 프로필</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="공유"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <Button size="sm" variant="outline" onClick={handleOpenEditor}>
            편집
          </Button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pb-16 pt-6 space-y-6">
        {/* ── Profile Section ── */}
        <section className="flex flex-col items-center gap-3 pt-2">
          {/* Avatar */}
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
          />
          {/* Name & Handle */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">{profile.display_name}</h1>
            {profile.handle && (
              <p className="text-sm text-gray-400">({profile.handle})</p>
            )}
            <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
          </div>
          {/* Social Badges — Pill Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {profile.socials.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5" /> GitHub
              </a>
            )}
            {profile.socials.instagram && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <InstagramIcon className="h-3.5 w-3.5" /> Insta
              </a>
            )}
            {profile.socials.email && (
              <a
                href={profile.socials.email}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
            )}
          </div>
        </section>

        {/* ── Link Sections ── */}
        {sections.map(section => (
          <section key={section}>
            {/* Section Header */}
            <h2 className="text-sm font-bold text-gray-800 mb-3 px-1">{section}</h2>
            <div className="space-y-2">
              {activeLinks
                .filter(l => (l.section || '기타') === section)
                .map(link => (
                  <LinkCard key={link.id} link={link} />
                ))}
            </div>
          </section>
        ))}

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-gray-400 pt-4">
          Powered by <span className="text-blue-500 font-medium">MyLink</span> · 토스 스타일
        </footer>
      </main>

      {/* ── Toast ── */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 space-y-5 rounded-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">프로필 편집</h2>
              <button onClick={() => setIsEditing(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Profile fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">이름</label>
                <Input value={editProfile.display_name} onChange={e => setEditProfile({ ...editProfile, display_name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">핸들 (Handle)</label>
                <Input value={editProfile.handle || ''} onChange={e => setEditProfile({ ...editProfile, handle: e.target.value })} placeholder="Gildong" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">한 줄 소개</label>
                <Input value={editProfile.bio} onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">아바타 URL</label>
                <Input value={editProfile.avatar_url} onChange={e => setEditProfile({ ...editProfile, avatar_url: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">GitHub URL</label>
                <Input value={editProfile.socials.github || ''} onChange={e => setEditProfile({ ...editProfile, socials: { ...editProfile.socials, github: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Instagram URL</label>
                <Input value={editProfile.socials.instagram || ''} onChange={e => setEditProfile({ ...editProfile, socials: { ...editProfile.socials, instagram: e.target.value } })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                <Input value={editProfile.socials.email || ''} onChange={e => setEditProfile({ ...editProfile, socials: { ...editProfile.socials, email: e.target.value } })} />
              </div>
            </div>

            <hr />

            {/* Existing links */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold">링크 목록</h3>
              {editLinks.map(link => (
                <div key={link.id} className="border rounded-xl p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={link.title}
                      onChange={e => updateLink(link.id, 'title', e.target.value)}
                      placeholder="제목"
                      className="flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={() => toggleLinkActive(link.id)}>
                      {link.is_active ? 'ON' : 'OFF'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteLink(link.id)}>삭제</Button>
                  </div>
                  <Input
                    value={link.description || ''}
                    onChange={e => updateLink(link.id, 'description', e.target.value)}
                    placeholder="설명 (선택)"
                  />
                  <Input
                    value={link.url}
                    onChange={e => updateLink(link.id, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                  <Input
                    value={link.section || ''}
                    onChange={e => updateLink(link.id, 'section', e.target.value)}
                    placeholder="섹션 (예: 🚀 주요 프로젝트)"
                  />
                </div>
              ))}

              {/* Add new link */}
              <div className="border border-dashed rounded-xl p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-600">➕ 새 링크 추가</p>
                <Input placeholder="제목" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <Input placeholder="설명 (선택)" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                <Input placeholder="URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                <Input placeholder="섹션 이름 (예: 📣 소셜 채널)" value={newSection} onChange={e => setNewSection(e.target.value)} />
                <Button size="sm" onClick={handleAddLink}>추가</Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>취소</Button>
              <Button onClick={handleSaveAll}>저장</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

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
import { Share2, Github, Instagram, Mail, X } from 'lucide-react';

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
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            )}
            {profile.socials.instagram && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" /> Insta
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

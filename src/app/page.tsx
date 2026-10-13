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
import { ProfileCard } from '@/components/profile-card';
import { LinkCard } from '@/components/link-card';
import { SocialLinks } from '@/components/social-links';
import { Settings, X, Plus, Trash2 } from 'lucide-react';

export default function Page() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit modal state
  const [editProfile, setEditProfile] = useState<Profile>(INITIAL_PROFILE);
  const [editLinks, setEditLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    setProfile(getStoredProfile());
    setLinks(getStoredLinks());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
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
    showToast('성공적으로 저장되었어요');
  };

  const handleAddLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const newItem: LinkItem = {
      id: `link_${Date.now()}`,
      title: newTitle.trim(),
      url: newUrl.trim(),
      is_active: true,
      display_order: editLinks.length + 1,
    };
    setEditLinks([...editLinks, newItem]);
    setNewTitle('');
    setNewUrl('');
  };

  const toggleLinkActive = (id: string) => {
    setEditLinks(editLinks.map(l => l.id === id ? { ...l, is_active: !l.is_active } : l));
  };

  const deleteLink = (id: string) => {
    setEditLinks(editLinks.filter(l => l.id !== id));
  };

  const updateLinkTitle = (id: string, val: string) => {
    setEditLinks(editLinks.map(l => l.id === id ? { ...l, title: val } : l));
  };

  const updateLinkUrl = (id: string, val: string) => {
    setEditLinks(editLinks.map(l => l.id === id ? { ...l, url: val } : l));
  };

  const activeLinks = links.filter(l => l.is_active);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] py-8 sm:py-12 px-4 transition-colors">
      <div className="max-w-md mx-auto flex flex-col space-y-6">
        {/* ── Top Bar: 시연용 편집 토글 버튼 ── */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 text-xs text-[#4E5968] hover:text-[#191F28] border-gray-200 shadow-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>편집</span>
          </Button>
        </div>

        {/* ── 프로필 헤더 (Profile Card) ── */}
        <ProfileCard profile={profile} />

        {/* ── 링크 리스트 (Link Cards) ── */}
        <section className="space-y-3 pt-2">
          {activeLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}

          {activeLinks.length === 0 && (
            <div className="p-8 text-center text-sm text-[#8B95A1] bg-white rounded-2xl border border-gray-100">
              표시할 링크가 없어요. 상단 편집 버튼을 눌러 추가해보세요.
            </div>
          )}
        </section>

        {/* ── 소셜 아이콘 바 (Social Icons) ── */}
        <SocialLinks socials={profile.socials} />

        {/* ── Footer ── */}
        <footer className="text-center pt-8 pb-4">
          <p className="text-xs text-[#8B95A1] font-medium tracking-wide">
            Powered by <span className="text-blue-500 font-semibold">MyLink</span>
          </p>
        </footer>
      </div>

      {/* ── Toast Feedback ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#191F28] text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* ── Edit Modal (시연용 편집기) ── */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-6 rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#191F28]">프로필 및 링크 편집</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile fields */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">프로필 정보</h3>
              <div>
                <label className="text-xs font-semibold text-[#4E5968] mb-1 block">이름</label>
                <Input
                  value={editProfile.display_name}
                  onChange={e => setEditProfile({ ...editProfile, display_name: e.target.value })}
                  placeholder="표시될 이름"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4E5968] mb-1 block">한 줄 소개</label>
                <Input
                  value={editProfile.bio}
                  onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                  placeholder="간단한 소개글"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4E5968] mb-1 block">아바타 이미지 URL</label>
                <Input
                  value={editProfile.avatar_url}
                  onChange={e => setEditProfile({ ...editProfile, avatar_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Link items */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">링크 관리</h3>
              
              <div className="space-y-2.5">
                {editLinks.map(link => (
                  <div key={link.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={link.title}
                        onChange={e => updateLinkTitle(link.id, e.target.value)}
                        placeholder="링크 제목"
                        className="flex-1 text-sm bg-white"
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
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      value={link.url}
                      onChange={e => updateLinkUrl(link.id, e.target.value)}
                      placeholder="https://..."
                      className="text-xs bg-white text-gray-600"
                    />
                  </div>
                ))}
              </div>

              {/* Add new link */}
              <div className="p-3.5 border border-dashed border-gray-200 rounded-2xl space-y-2.5 bg-white">
                <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> 새 링크 추가
                </p>
                <Input
                  placeholder="링크 제목 (예: 🎬 유튜브 채널)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
                <Input
                  placeholder="URL (예: https://youtube.com)"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                />
                <Button size="sm" onClick={handleAddLink} className="w-full text-xs">
                  목록에 추가하기
                </Button>
              </div>
            </div>

            {/* Modal Actions */}
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
    </div>
  );
}

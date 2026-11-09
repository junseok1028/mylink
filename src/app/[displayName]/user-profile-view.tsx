'use client';

import React from 'react';
import Link from 'next/link';
import { Profile, LinkItem } from '@/lib/types';
import { LinkIcon } from '@/components/link-icon';
import { Share2, ExternalLink, Link2, ArrowLeft, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import { incrementLinkClicks } from '@/lib/firestore-links';

interface UserProfileViewProps {
  profile: Profile;
  links: LinkItem[];
  displayName: string;
  targetUserId?: string;
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

function EmailIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function UserProfileView({
  profile,
  links,
  displayName,
  targetUserId,
}: UserProfileViewProps) {
  // 클릭수 로컬 상태 관리 (낙관적 UI 반영)
  const [clickCounts, setClickCounts] = React.useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    links.forEach((l) => {
      initial[l.id] = l.clicks ?? 0;
    });
    return initial;
  });

  React.useEffect(() => {
    setClickCounts((prev) => {
      const updated = { ...prev };
      links.forEach((l) => {
        if (updated[l.id] === undefined) {
          updated[l.id] = l.clicks ?? 0;
        }
      });
      return updated;
    });
  }, [links]);

  const handleLinkClick = (linkId: string) => {
    // 공개 프로필(새 페이지)에서는 소유자와 방문자 모두 클릭 시 카운트 증가
    // (편집 모드 대시보드 / 에서는 증가하지 않음)
    setClickCounts((prev) => ({
      ...prev,
      [linkId]: (prev[linkId] ?? 0) + 1,
    }));

    // Firestore에 카운트 1 증가 영구 저장
    if (targetUserId) {
      incrementLinkClicks(targetUserId, linkId);
    }
  };

  // 활성화된 링크 필터링
  const activeLinks = React.useMemo(() => links.filter((l) => l.is_active !== false), [links]);

  // 섹션 목록 추출
  const sections = React.useMemo(
    () => Array.from(new Set(activeLinks.map((l) => l.section || '기타'))),
    [activeLinks]
  );

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator
          .share({
            title: `${profile.display_name || displayName} - 마이링크 프로필`,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('프로필 링크가 복사되었습니다');
      }
    }
  };

  const nameToDisplay = profile.display_name || displayName;
  const initialChar = nameToDisplay.slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl sm:shadow-lg sm:border sm:border-gray-100 flex flex-col overflow-hidden">
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-5 py-3 flex justify-between items-center transition-all">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5968] hover:text-[#191F28] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              M
            </div>
            <span className="text-xs font-bold text-[#191F28]">MyLink</span>
          </div>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-full text-[#4E5968] hover:text-[#191F28] hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="프로필 공유하기"
            title="프로필 링크 공유"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </header>

        {/* ── 상단 : 프로필 카드 (이름, 소개글) ── */}
        <section className="flex flex-col items-center text-center px-5 pt-8 pb-5 space-y-3">
          {/* Avatar (80x80 Round) */}
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={nameToDisplay}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-50 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center ring-4 ring-gray-50 shadow-sm">
                {initialChar}
              </div>
            )}
          </div>

          {/* 이름 & 핸들 */}
          <div>
            <h1 className="text-[22px] font-bold text-[#191F28] leading-tight tracking-tight">
              {nameToDisplay}
              {profile.handle && (
                <span className="text-[15px] font-normal text-[#8B95A1] ml-1.5">
                  ({profile.handle.startsWith('@') ? profile.handle : `@${profile.handle}`})
                </span>
              )}
            </h1>

            {/* 소개글 */}
            <p className="text-[14px] text-[#4E5968] mt-2 font-medium px-4 leading-relaxed break-keep">
              &quot;{profile.bio || '나만의 링크를 한곳에서 확인해보세요 🚀'}&quot;
            </p>
          </div>

          {/* 소셜 링크 배지 (선택 사항) */}
          {profile.socials &&
            (profile.socials.github ||
              profile.socials.instagram ||
              profile.socials.youtube ||
              profile.socials.blog ||
              profile.socials.email) && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                {profile.socials.email && (
                  <a
                    href={`mailto:${profile.socials.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/80 active:scale-95 text-xs font-semibold text-[#333D4B] transition-all"
                  >
                    <EmailIcon className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            )}
        </section>

        {/* ── 하단 : 링크 목록 (클릭 시 새 탭) ── */}
        <main className="flex-1 px-5 py-4 space-y-6">
          {activeLinks.length > 0 ? (
            sections.map((section) => (
              <div key={section} className="space-y-2.5">
                {/* 섹션 제목 */}
                <h2 className="text-[14px] font-bold text-[#191F28] px-1 tracking-tight">
                  {section}
                </h2>

                {/* 링크 카드 목록 (클릭 시 새 탭) */}
                <div className="space-y-2.5">
                  {activeLinks
                    .filter((l) => (l.section || '기타') === section)
                    .map((link) => {
                      const href =
                        link.url.startsWith('http') || link.url.startsWith('mailto:')
                          ? link.url
                          : `https://${link.url}`;

                      return (
                        <a
                          key={link.id}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLinkClick(link.id)}
                          className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-md active:scale-[0.99] transition-all duration-200 text-left block"
                        >
                          {/* 파비콘 / 도메인 아이콘 */}
                          <LinkIcon
                            url={link.url}
                            title={link.title}
                            className="w-11 h-11 group-hover:scale-105 transition-transform duration-200 shrink-0"
                            size={22}
                          />

                          {/* 링크 정보 */}
                          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            <span className="text-[15px] font-bold text-[#191F28] leading-snug truncate group-hover:text-blue-600 transition-colors">
                              {link.title}
                            </span>
                            {link.description && (
                              <span className="text-[13px] text-[#4E5968] leading-tight line-clamp-1">
                                {link.description}
                              </span>
                            )}
                            {/* 미니멀한 클릭 카운트 (아이콘과 숫자만) */}
                            <div className="flex items-center gap-1 text-[11px] text-[#8B95A1] font-normal mt-0.5">
                              <MousePointerClick className="w-3 h-3 text-[#8B95A1]" />
                              <span>{clickCounts[link.id] ?? link.clicks ?? 0}</span>
                            </div>
                          </div>

                          {/* 새 탭 외부 링크 아이콘 */}
                          <div className="p-1 rounded-full text-[#B0B8C1] group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </a>
                      );
                    })}
                </div>
              </div>
            ))
          ) : (
            /* 링크가 없을 때 */
            <div className="py-12 px-6 text-center space-y-2 bg-gray-50/80 border border-gray-100 rounded-3xl">
              <p className="text-sm font-bold text-[#191F28]">등록된 링크가 아직 없습니다</p>
              <p className="text-xs text-[#8B95A1]">새로운 링크가 등록되면 여기에 표시됩니다.</p>
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="text-center py-6 border-t border-gray-50 mt-auto">
          <p className="text-xs text-[#8B95A1]">
            Powered by{' '}
            <Link href="/" className="text-[#3182F6] font-semibold hover:underline">
              MyLink
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

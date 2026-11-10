'use client';

import * as React from 'react';
import { SocialLinkItem, SocialLinks } from '@/lib/types';
import {
  Mail,
  Globe,
  Link2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export interface SocialPlatformOption {
  id: string;
  name: string;
  placeholder: string;
  defaultLabel: string;
  prefixUrl?: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder?: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformOption[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    defaultLabel: 'Instagram',
    placeholder: 'https://instagram.com/username 또는 @username',
    prefixUrl: 'https://instagram.com/',
    badgeBg: 'bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100',
    badgeText: 'text-pink-700',
    badgeBorder: 'border-pink-200/60',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    defaultLabel: 'YouTube',
    placeholder: 'https://youtube.com/@channel',
    prefixUrl: 'https://youtube.com/',
    badgeBg: 'bg-red-50 hover:bg-red-100/80',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200/60',
  },
  {
    id: 'github',
    name: 'GitHub',
    defaultLabel: 'GitHub',
    placeholder: 'https://github.com/username',
    prefixUrl: 'https://github.com/',
    badgeBg: 'bg-gray-100 hover:bg-gray-200/80',
    badgeText: 'text-[#191F28]',
    badgeBorder: 'border-gray-300/60',
  },
  {
    id: 'email',
    name: 'Email (이메일)',
    defaultLabel: 'Email',
    placeholder: 'name@example.com',
    badgeBg: 'bg-blue-50 hover:bg-blue-100/80',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200/60',
  },
  {
    id: 'blog',
    name: '블로그 / 웹사이트',
    defaultLabel: 'Blog',
    placeholder: 'https://velog.io/@username 또는 https://myblog.com',
    badgeBg: 'bg-emerald-50 hover:bg-emerald-100/80',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200/60',
  },
  {
    id: 'x',
    name: 'X (트위터)',
    defaultLabel: 'X',
    placeholder: 'https://x.com/username 또는 @username',
    prefixUrl: 'https://x.com/',
    badgeBg: 'bg-black text-white hover:bg-gray-800',
    badgeText: 'text-white',
    badgeBorder: 'border-black',
  },
  {
    id: 'threads',
    name: 'Threads',
    defaultLabel: 'Threads',
    placeholder: 'https://threads.net/@username',
    prefixUrl: 'https://threads.net/@',
    badgeBg: 'bg-gray-900 text-white hover:bg-black',
    badgeText: 'text-white',
    badgeBorder: 'border-gray-800',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    defaultLabel: 'TikTok',
    placeholder: 'https://tiktok.com/@username',
    prefixUrl: 'https://tiktok.com/@',
    badgeBg: 'bg-zinc-900 text-white hover:bg-black',
    badgeText: 'text-white',
    badgeBorder: 'border-zinc-800',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    defaultLabel: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    prefixUrl: 'https://linkedin.com/in/',
    badgeBg: 'bg-sky-50 hover:bg-sky-100/80',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200/60',
  },
  {
    id: 'custom',
    name: '기타 (직접 입력)',
    defaultLabel: 'Link',
    placeholder: 'https://example.com',
    badgeBg: 'bg-gray-100 hover:bg-gray-200/80',
    badgeText: 'text-[#333D4B]',
    badgeBorder: 'border-gray-200',
  },
];

export function getPlatformMeta(platformId: string): SocialPlatformOption {
  const normalized = platformId.toLowerCase();
  const found = SOCIAL_PLATFORMS.find((p) => p.id === normalized);
  if (found) return found;

  return {
    id: platformId,
    name: platformId,
    defaultLabel: platformId,
    placeholder: 'https://...',
    badgeBg: 'bg-gray-100 hover:bg-gray-200/80',
    badgeText: 'text-[#333D4B]',
    badgeBorder: 'border-gray-200',
  };
}

// SVG 아이콘들
export function SocialIcon({ platform, className = 'w-3.5 h-3.5' }: { platform: string; className?: string }) {
  const p = platform.toLowerCase();

  if (p === 'instagram') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }

  if (p === 'youtube') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }

  if (p === 'github') {
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

  if (p === 'email') {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  if (p === 'x' || p === 'twitter') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (p === 'threads') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.095 5.467 0 12.186 0c6.602 0 11.814 4.94 11.814 11.814 0 .61-.044 1.218-.13 1.815h-4.09c.07-.44.108-.888.108-1.344 0-4.22-3.486-7.65-7.702-7.65-4.215 0-7.702 3.43-7.702 7.65 0 4.217 3.487 7.65 7.702 7.65 2.115 0 4.025-.862 5.405-2.254l2.84 2.84C18.423 22.39 15.485 24 12.186 24zm2.148-11.21c-.244-1.572-1.584-2.79-3.21-2.79-1.8 0-3.256 1.458-3.256 3.257 0 1.8 1.456 3.257 3.256 3.257 1.34 0 2.493-.812 2.993-1.97h3.935c-.69 3.328-3.64 5.845-7.18 5.845-4.053 0-7.34-3.287-7.34-7.34 0-4.054 3.287-7.34 7.34-7.34 3.633 0 6.643 2.65 7.214 6.136l-3.752.945z" />
      </svg>
    );
  }

  if (p === 'tiktok') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23 1.02.14 2.12.92 2.82.72.67 1.76.92 2.71.74.88-.14 1.69-.74 2.06-1.54.26-.52.37-1.11.37-1.7.03-4.66.02-9.33.02-14z" />
      </svg>
    );
  }

  if (p === 'linkedin') {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }

  if (p === 'blog') {
    return <Globe className={className} />;
  }

  return <Link2 className={className} />;
}

/**
 * 기존 profile.socials (객체)와 profile.social_links (배열)를
 * 안전하게 단일 SocialLinkItem 배열로 정규화하는 헬퍼 함수
 */
export function normalizeSocialLinks(
  socials?: SocialLinks,
  socialLinks?: SocialLinkItem[],
  defaultEmail?: string
): SocialLinkItem[] {
  // 1. 이미 social_links 배열이 있다면 그것을 우선 사용
  if (Array.isArray(socialLinks) && socialLinks.length > 0) {
    return socialLinks.filter((item) => item && item.url && item.url.trim() !== '');
  }

  // 2. socials 객체로부터 변환
  const items: SocialLinkItem[] = [];

  if (socials && typeof socials === 'object') {
    // 순서 지정: 이메일, 인스타그램, 유튜브, 깃허브, 블로그 등
    const keys = Object.keys(socials);
    for (const key of keys) {
      const url = socials[key];
      if (typeof url === 'string' && url.trim() !== '') {
        const meta = getPlatformMeta(key);
        items.push({
          id: `sl_${key}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          platform: key,
          label: meta.defaultLabel,
          url: url.trim(),
        });
      }
    }
  }

  // 3. 만약 소셜 링크가 전혀 등록되어 있지 않고 defaultEmail이 있다면 초기값으로 이메일 1개 제공
  if (items.length === 0 && defaultEmail && defaultEmail.trim() !== '') {
    items.push({
      id: `sl_email_default`,
      platform: 'email',
      label: 'Email',
      url: defaultEmail.trim(),
    });
  }

  return items;
}

/**
 * SocialLinkItem 배열을 Firestore 호환 socials 객체로 변환
 */
export function itemsToSocialsObject(items: SocialLinkItem[]): SocialLinks {
  const obj: Record<string, string> = {};
  for (const item of items) {
    if (item.url && item.url.trim() !== '') {
      obj[item.platform] = item.url.trim();
    }
  }
  return obj;
}

/**
 * URL 포맷 헬퍼 (http/https 또는 mailto 접두사 자동 처리)
 */
export function formatSocialUrl(platform: string, rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  if (platform === 'email') {
    return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // @username 형태의 인스타/트위터/틱톡 처리
  if (trimmed.startsWith('@')) {
    const username = trimmed.slice(1);
    if (platform === 'instagram') return `https://instagram.com/${username}`;
    if (platform === 'x' || platform === 'twitter') return `https://x.com/${username}`;
    if (platform === 'tiktok') return `https://tiktok.com/@${username}`;
    if (platform === 'threads') return `https://threads.net/@${username}`;
    if (platform === 'youtube') return `https://youtube.com/@${username}`;
  }

  return `https://${trimmed}`;
}

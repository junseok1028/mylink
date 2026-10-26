'use client';

import * as React from 'react';
import { Globe, BookOpen } from 'lucide-react';

interface LinkIconProps {
  url: string;
  title?: string;
  className?: string;
  size?: number;
}

export function detectPlatform(url: string, title?: string): {
  type: string;
  label: string;
  bgColor: string;
  domain: string;
} {
  const cleanUrl = url.toLowerCase().trim();
  const cleanTitle = (title || '').toLowerCase();

  try {
    const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    const host = parsed.hostname.replace(/^www\./, '');

    // 1. YouTube
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return { type: 'youtube', label: 'YouTube', bgColor: 'bg-red-50 text-[#FF0000]', domain: host };
    }

    // 2. Google
    if (host.includes('google.com') || host.includes('google.co.kr') || host.includes('goo.gl')) {
      return { type: 'google', label: 'Google', bgColor: 'bg-blue-50 text-blue-600', domain: host };
    }

    // 3. Blog Platforms
    if (host.includes('velog.io')) {
      return { type: 'velog', label: 'Velog', bgColor: 'bg-emerald-50 text-[#20C997]', domain: host };
    }
    if (host.includes('blog.naver.com') || host.includes('in.naver.com')) {
      return { type: 'naver-blog', label: 'Naver Blog', bgColor: 'bg-green-50 text-[#03C75A]', domain: host };
    }
    if (host.includes('tistory.com')) {
      return { type: 'tistory', label: 'Tistory', bgColor: 'bg-orange-50 text-[#FF5A00]', domain: host };
    }
    if (host.includes('brunch.co.kr')) {
      return { type: 'brunch', label: 'Brunch', bgColor: 'bg-emerald-50 text-[#00C473]', domain: host };
    }
    if (host.includes('medium.com')) {
      return { type: 'medium', label: 'Medium', bgColor: 'bg-gray-100 text-[#191F28]', domain: host };
    }
    if (host.includes('substack.com')) {
      return { type: 'substack', label: 'Substack', bgColor: 'bg-orange-50 text-[#FF6719]', domain: host };
    }
    if (host.includes('blog') || parsed.pathname.includes('/blog') || cleanTitle.includes('블로그') || cleanTitle.includes('blog')) {
      return { type: 'generic-blog', label: 'Blog', bgColor: 'bg-emerald-50 text-emerald-600', domain: host };
    }

    // 4. GitHub
    if (host.includes('github.com') || host.includes('github.io')) {
      return { type: 'github', label: 'GitHub', bgColor: 'bg-gray-100 text-[#24292F]', domain: host };
    }

    // 5. Instagram
    if (host.includes('instagram.com')) {
      return { type: 'instagram', label: 'Instagram', bgColor: 'bg-pink-50 text-[#E4405F]', domain: host };
    }

    // 6. X (Twitter)
    if (host.includes('twitter.com') || host.includes('x.com')) {
      return { type: 'x', label: 'X', bgColor: 'bg-gray-100 text-black', domain: host };
    }

    // 7. Notion
    if (host.includes('notion.so') || host.includes('notion.site')) {
      return { type: 'notion', label: 'Notion', bgColor: 'bg-gray-100 text-black', domain: host };
    }

    // 8. LinkedIn
    if (host.includes('linkedin.com')) {
      return { type: 'linkedin', label: 'LinkedIn', bgColor: 'bg-blue-50 text-[#0A66C2]', domain: host };
    }

    // 9. Discord
    if (host.includes('discord.com') || host.includes('discord.gg')) {
      return { type: 'discord', label: 'Discord', bgColor: 'bg-indigo-50 text-[#5865F2]', domain: host };
    }

    // 10. Kakao
    if (host.includes('kakao.com') || host.includes('open.kakao.com')) {
      return { type: 'kakao', label: 'Kakao', bgColor: 'bg-yellow-100 text-[#3C1E1E]', domain: host };
    }

    // 11. Figma
    if (host.includes('figma.com')) {
      return { type: 'figma', label: 'Figma', bgColor: 'bg-purple-50 text-[#F24E1E]', domain: host };
    }

    return { type: 'website', label: host, bgColor: 'bg-gray-100 text-[#4E5968]', domain: host };
  } catch {
    return { type: 'website', label: 'Link', bgColor: 'bg-gray-100 text-[#4E5968]', domain: '' };
  }
}

export function LinkIcon({ url, title, className = 'w-10 h-10', size = 20 }: LinkIconProps) {
  const [imgError, setImgError] = React.useState(false);
  const platform = detectPlatform(url, title);

  // 1. YouTube 로고 (공식 SVG)
  if (platform.type === 'youtube') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-red-50 text-[#FF0000] shrink-0 transition-transform ${className}`}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
    );
  }

  // 2. Google 로고 (공식 4컬러 SVG)
  if (platform.type === 'google') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-xs shrink-0 transition-transform ${className}`}>
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      </div>
    );
  }

  // 3. GitHub 로고
  if (platform.type === 'github') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gray-100 text-[#191F28] shrink-0 transition-transform ${className}`}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      </div>
    );
  }

  // 4. Velog 로고 (초록 V)
  if (platform.type === 'velog') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-[#20C997]/10 text-[#20C997] shrink-0 font-black transition-transform ${className}`}>
        <span style={{ fontSize: size * 0.85, lineHeight: 1 }} className="font-bold tracking-tighter">
          v
        </span>
      </div>
    );
  }

  // 5. Naver Blog 로고 (초록 N)
  if (platform.type === 'naver-blog') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-[#03C75A]/10 text-[#03C75A] shrink-0 font-black transition-transform ${className}`}>
        <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
        </svg>
      </div>
    );
  }

  // 6. Tistory 로고 (오렌지 3개 원)
  if (platform.type === 'tistory') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-[#FF5A00]/10 text-[#FF5A00] shrink-0 transition-transform ${className}`}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="12" cy="4" r="3.2" />
          <circle cx="4" cy="12" r="3.2" />
          <circle cx="20" cy="12" r="3.2" />
          <circle cx="12" cy="20" r="3.2" />
        </svg>
      </div>
    );
  }

  // 7. General Blog / Medium / Brunch / Substack
  if (platform.type === 'generic-blog' || platform.type === 'medium' || platform.type === 'brunch' || platform.type === 'substack') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0 transition-transform ${className}`}>
        <BookOpen width={size} height={size} strokeWidth={2.2} />
      </div>
    );
  }

  // 8. Instagram 로고
  if (platform.type === 'instagram') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white shrink-0 transition-transform ${className}`}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>
    );
  }

  // 9. X (Twitter) 로고
  if (platform.type === 'x') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gray-100 text-black shrink-0 transition-transform ${className}`}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    );
  }

  // 10. Notion 로고
  if (platform.type === 'notion') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-white border border-gray-200 text-black shrink-0 transition-transform ${className}`}>
        <span style={{ fontSize: size, lineHeight: 1 }} className="font-serif font-black">
          N
        </span>
      </div>
    );
  }

  // 11. LinkedIn 로고
  if (platform.type === 'linkedin') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-[#0A66C2] text-white shrink-0 font-bold transition-transform ${className}`}>
        <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>in</span>
      </div>
    );
  }

  // 12. Kakao 로고
  if (platform.type === 'kakao') {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-[#FEE500] text-[#191919] shrink-0 font-bold transition-transform ${className}`}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.87 1.89 5.39 4.75 6.75l-1.2 4.41c-.1.38.33.68.66.47l5.24-3.48c.18.02.36.03.55.03 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
        </svg>
      </div>
    );
  }

  // 13. 기타 일반 사이트: Google Favicon API or Globe fallback
  if (platform.domain && !imgError) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${platform.domain}&sz=64`;
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100/80 p-2 shrink-0 overflow-hidden ${className}`}>
        <img
          src={faviconUrl}
          alt={platform.domain}
          width={size}
          height={size}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain rounded-md"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-xl bg-gray-100 text-[#8B95A1] shrink-0 ${className}`}>
      <Globe width={size} height={size} strokeWidth={2} />
    </div>
  );
}

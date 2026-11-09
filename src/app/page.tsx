import type { Metadata } from 'next';
import HomeClient from './home-client';

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://mylink.kr');

export const metadata: Metadata = {
  title: '마이링크 (MyLink) - 나만의 올인원 바이오 프로필 링크',
  description:
    '인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 모아 단 1분 만에 감각적인 모바일 프로필 페이지를 무료로 만들어보세요.',
  keywords: [
    '마이링크',
    'MyLink',
    '바이오링크',
    '인스타링크',
    '프로필링크',
    '링크트리',
    '멀티링크',
    '포트폴리오',
    '링크모음',
    '디지털명함',
    '링크인바이오',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '마이링크 (MyLink) - 나만의 올인원 바이오 프로필 링크',
    description:
      '인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 모아 단 1분 만에 감각적인 모바일 프로필 페이지를 무료로 만들어보세요.',
    url: siteUrl,
    siteName: '마이링크 (MyLink)',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/api/og?title=MyLink&type=static',
        width: 1200,
        height: 630,
        alt: '마이링크 (MyLink)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '마이링크 (MyLink) - 나만의 올인원 바이오 프로필 링크',
    description:
      '인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 모아 단 1분 만에 감각적인 모바일 프로필 페이지를 무료로 만들어보세요.',
    images: ['/api/og?title=MyLink&type=static'],
  },
};

export default function Page() {
  return <HomeClient />;
}

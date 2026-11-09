import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '통계 분석 대시보드',
  description: '내 마이링크의 실시간 링크 클릭 수, 방문자 수 및 트래픽 분석 통계를 확인하세요.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: '통계 분석 대시보드 | 마이링크 (MyLink)',
    description: '내 마이링크의 링크 클릭 수 및 방문자 통계 분석',
    type: 'website',
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

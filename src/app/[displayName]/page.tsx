import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  findUserByDisplayName,
  getUserProfileFromFirestore,
  getLinksFromFirestore,
} from '@/lib/firestore-links';
import { UserProfileView } from './user-profile-view';
import { Profile } from '@/lib/types';

// 항상 최신 Firestore 데이터 조회
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    displayName: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawDisplayName = resolvedParams?.displayName;
  const decodedDisplayName = rawDisplayName
    ? decodeURIComponent(rawDisplayName).trim()
    : 'MyLink';

  let displayName = decodedDisplayName;
  let bio = '';
  let avatarUrl = '';
  try {
    const userResult = await findUserByDisplayName(decodedDisplayName);
    if (userResult?.userId) {
      const profile = await getUserProfileFromFirestore(userResult.userId);
      displayName = profile?.display_name || decodedDisplayName;
      bio = profile?.bio || '';
      avatarUrl = profile?.avatar_url || '';
    }
  } catch {
    // 조회 실패 시 displayName 기본값 사용
  }

  const title = `${displayName}의 바이오 프로필`;
  const description = bio
    ? `${bio} | ${displayName}님의 마이링크`
    : `${displayName}님의 SNS 채널, 포트폴리오, 주요 링크 모음 페이지입니다.`;
  const ogUrl = `/api/og?title=${encodeURIComponent(displayName)}&type=dynamic`;
  const canonicalPath = `/${encodeURIComponent(decodedDisplayName)}`;

  return {
    title,
    description,
    keywords: [
      displayName,
      decodedDisplayName,
      `${displayName} 프로필`,
      `${displayName} 링크`,
      '마이링크',
      'MyLink',
      '바이오링크',
      '인스타링크',
      '프로필링크',
      '링크모음',
    ],
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${displayName}의 바이오 프로필 | 마이링크 (MyLink)`,
      description,
      url: canonicalPath,
      siteName: '마이링크 (MyLink)',
      locale: 'ko_KR',
      type: 'profile',
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `${displayName}의 마이링크 프로필`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName}의 바이오 프로필 | 마이링크 (MyLink)`,
      description,
      images: [ogUrl],
    },
  };
}

export default async function DynamicUserProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawDisplayName = resolvedParams?.displayName;

  if (!rawDisplayName) {
    notFound();
  }

  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();

  if (!decodedDisplayName) {
    notFound();
  }

  // 1. displayName으로 user 검색 (Firestore where 쿼리 사용)
  const userResult = await findUserByDisplayName(decodedDisplayName);

  // 일치하는 사용자가 없으면 404 페이지로 이동
  if (!userResult || !userResult.userId) {
    notFound();
  }

  const { userId } = userResult;

  // 2. 프로필 : users/{userid}/profile 조회 (항상 최신 DB 프로필 우선 조회)
  const fetchedProfile = (await getUserProfileFromFirestore(userId)) || userResult.profile;
  const profile: Profile = {
    username: fetchedProfile?.username || decodedDisplayName,
    display_name: fetchedProfile?.display_name || decodedDisplayName,
    handle: fetchedProfile?.handle,
    bio: fetchedProfile?.bio ?? '',
    avatar_url: fetchedProfile?.avatar_url || '',
    socials: fetchedProfile?.socials || {},
  };

  // 3. 링크 : users/{userid}/links 문서 조회
  const links = await getLinksFromFirestore(userId);

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://mylink.kr');
  const profileUrl = `${siteUrl}/${encodeURIComponent(decodedDisplayName)}`;

  const socialUrls = Object.values(profile.socials || {})
    .filter((url): url is string => Boolean(url))
    .map((url) => (url.startsWith('http') ? url : `https://${url}`));

  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.display_name || decodedDisplayName,
      alternateName: decodedDisplayName,
      description: profile.bio || `${profile.display_name || decodedDisplayName}의 바이오 프로필`,
      image: profile.avatar_url || undefined,
      url: profileUrl,
      sameAs: socialUrls,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <UserProfileView
        profile={profile}
        links={links}
        displayName={decodedDisplayName}
        targetUserId={userId}
      />
    </>
  );
}

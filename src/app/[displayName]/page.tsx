import { notFound } from 'next/navigation';
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

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const rawDisplayName = resolvedParams?.displayName;
  const decodedDisplayName = rawDisplayName
    ? decodeURIComponent(rawDisplayName).trim()
    : 'MyLink';

  // 프로필 조회해서 더 풍부한 메타데이터 제공
  let displayName = decodedDisplayName;
  let bio = '';
  try {
    const userResult = await findUserByDisplayName(decodedDisplayName);
    if (userResult?.userId) {
      const profile = await getUserProfileFromFirestore(userResult.userId);
      displayName = profile?.display_name || decodedDisplayName;
      bio = profile?.bio || '';
    }
  } catch {
    // 조회 실패 시 displayName 기본값 사용
  }

  const title = `${displayName} – MyLink`;
  const ogUrl = `/api/og?title=${encodeURIComponent(displayName)}&type=dynamic`;

  return {
    title,
    description: bio || `${displayName}의 개인 링크 페이지`,
    openGraph: {
      title,
      description: bio || `${displayName}의 개인 링크 페이지`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: bio || `${displayName}의 개인 링크 페이지`,
      images: [ogUrl],
    },
  };
}

interface PageProps {
  params: Promise<{
    displayName: string;
  }>;
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

  return (
    <UserProfileView
      profile={profile}
      links={links}
      displayName={decodedDisplayName}
      targetUserId={userId}
    />
  );
}

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

// 참고: 메타 데이터는 나중에 추가할 예정 (향후 generateMetadata 추가 가능)

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

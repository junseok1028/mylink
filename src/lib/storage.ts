import { Profile, LinkItem } from './types';

const PROFILE_KEY = 'mylink_profile';
const LINKS_KEY = 'mylink_links';

export const INITIAL_PROFILE: Profile = {
  username: 'creator_kim',
  display_name: '김크리에이터',
  bio: '안녕하세요! 마이링크에 오신 것을 환영합니다 🚀',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  socials: {
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    email: 'mailto:creator@example.com',
  },
};

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: 'link_1',
    title: '🎬 유튜브 최신 영상 보러가기',
    url: 'https://youtube.com',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'link_2',
    title: '🛍️ 공식 스토어 구경하기',
    url: 'https://smartstore.naver.com',
    is_active: true,
    display_order: 2,
  },
  {
    id: 'link_3',
    title: '💬 1:1 오픈카카오톡 문의',
    url: 'https://open.kakao.com',
    is_active: true,
    display_order: 3,
  },
];

export function getStoredProfile(): Profile {
  if (typeof window === 'undefined') return INITIAL_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : INITIAL_PROFILE;
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveStoredProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getStoredLinks(): LinkItem[] {
  if (typeof window === 'undefined') return INITIAL_LINKS;
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? (JSON.parse(raw) as LinkItem[]) : INITIAL_LINKS;
  } catch {
    return INITIAL_LINKS;
  }
}

export function saveStoredLinks(links: LinkItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

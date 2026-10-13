import { Profile, LinkItem } from './types';

const PROFILE_KEY = 'mylink_profile_v2';
const LINKS_KEY = 'mylink_links_v2';

export const INITIAL_PROFILE: Profile = {
  username: 'junseok1028',
  display_name: '안준석',
  handle: 'Junseok',
  bio: '풀스택 개발자 & 크리에이터 🚀',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  socials: {
    github: 'https://github.com/junseok1028/mylink',
    instagram: 'https://instagram.com',
    email: 'mailto:junseok1028@example.com',
  },
};

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: 'link_1',
    title: '🎨 마이링크 (MyLink) 서비스',
    description: '토스 디자인 시스템 기반의 바이오 프로필 서비스',
    url: 'https://github.com/junseok1028/mylink',
    section: '🚀 주요 프로젝트 & 포트폴리오',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'link_2',
    title: '📖 개발 블로그 및 팁 (Velog)',
    description: '웹 개발 관련 소소한 이야기와 지식을 공유합니다',
    url: 'https://velog.io',
    section: '🚀 주요 프로젝트 & 포트폴리오',
    is_active: true,
    display_order: 2,
  },
  {
    id: 'link_3',
    title: '📺 개발자 안준석 유튜브 채널',
    description: '신규 프레임워크 리뷰 및 코딩 시연 라이브',
    url: 'https://youtube.com',
    section: '📢 소셜 채널',
    is_active: true,
    display_order: 3,
  },
  {
    id: 'link_4',
    title: '💬 1:1 오픈채팅방',
    description: '협업 문의 및 질문을 언제든 환영합니다',
    url: 'https://open.kakao.com',
    section: '📢 소셜 채널',
    is_active: true,
    display_order: 4,
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

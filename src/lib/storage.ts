import { Profile, LinkItem } from './types';

const PROFILE_KEY_PREFIX = 'mylink_user_profile_';
const LINKS_KEY_PREFIX = 'mylink_user_links_';

export const DEFAULT_PROFILE: Profile = {
  username: '',
  display_name: '',
  handle: '',
  bio: '',
  avatar_url: '',
  socials: {},
};

export const DEFAULT_LINKS: LinkItem[] = [];

export function getStoredUserProfile(userId: string): Profile | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY_PREFIX}${userId}`);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveStoredUserProfile(userId: string, profile: Profile): void {
  if (typeof window === 'undefined' || !userId) return;
  localStorage.setItem(`${PROFILE_KEY_PREFIX}${userId}`, JSON.stringify(profile));
}

export function getStoredUserLinks(userId: string): LinkItem[] {
  if (typeof window === 'undefined' || !userId) return [];
  try {
    const raw = localStorage.getItem(`${LINKS_KEY_PREFIX}${userId}`);
    return raw ? (JSON.parse(raw) as LinkItem[]) : [];
  } catch {
    return [];
  }
}

export function saveStoredUserLinks(userId: string, links: LinkItem[]): void {
  if (typeof window === 'undefined' || !userId) return;
  localStorage.setItem(`${LINKS_KEY_PREFIX}${userId}`, JSON.stringify(links));
}

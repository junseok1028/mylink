export interface SocialLinks {
  github?: string;
  instagram?: string;
  youtube?: string;
  email?: string;
  blog?: string;
  [key: string]: string | undefined;
}

export interface SocialLinkItem {
  id: string;
  platform: string; // 'instagram' | 'youtube' | 'github' | 'email' | 'blog' | 'x' | 'threads' | 'tiktok' | 'linkedin' | 'custom' 등
  label: string; // 표시 이름
  url: string; // 링크 URL 또는 이메일 주소
}

export interface Profile {
  username: string;
  display_name: string;
  handle?: string;
  bio: string;
  avatar_url: string;
  socials: SocialLinks;
  social_links?: SocialLinkItem[];
}

export interface DisplayNameCheckResult {
  available: boolean;
  message: string;
}

export interface LinkItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  section?: string;
  is_active: boolean;
  display_order: number;
  clicks?: number;
  clickCount?: number;
  createAt?: any;
  createdAt?: any;
  created_at?: any;
  updatedAt?: any;
  updated_at?: any;
}

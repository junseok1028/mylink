export interface SocialLinks {
  github?: string;
  instagram?: string;
  youtube?: string;
  email?: string;
  blog?: string;
  [key: string]: string | undefined;
}

export interface Profile {
  username: string;
  display_name: string;
  handle?: string;
  bio: string;
  avatar_url: string;
  socials: SocialLinks;
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

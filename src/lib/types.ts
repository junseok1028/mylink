export interface SocialLinks {
  github?: string;
  instagram?: string;
  youtube?: string;
  email?: string;
}

export interface Profile {
  username: string;
  display_name: string;
  handle?: string;
  bio: string;
  avatar_url: string;
  socials: SocialLinks;
}

export interface LinkItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  section?: string;
  is_active: boolean;
  display_order: number;
}

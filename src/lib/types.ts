export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  email?: string;
}

export interface Profile {
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  socials: SocialLinks;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  display_order: number;
}

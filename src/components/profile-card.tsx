import { Profile } from '@/lib/types';

interface ProfileCardProps {
  profile: Profile;
}

/**
 * Reusable Profile Card component displaying avatar, display name, and bio
 * styled with Toss TDS guidelines (design.md) using Tailwind CSS.
 */
export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 pt-2">
      {/* 80x80 Round Avatar */}
      <div className="relative">
        <img
          src={profile.avatar_url}
          alt={profile.display_name}
          className="w-20 h-20 rounded-full object-cover shadow-sm ring-4 ring-white"
        />
      </div>

      {/* Name & Bio */}
      <div className="space-y-1.5 max-w-sm px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#191F28] tracking-tight">
          {profile.display_name}
        </h1>
        <p className="text-sm sm:text-[15px] text-[#4E5968] leading-relaxed break-keep">
          {profile.bio}
        </p>
      </div>
    </div>
  );
}

import { SocialLinks as SocialLinksType } from '@/lib/types';
import { Mail, Video, Camera } from 'lucide-react';

interface SocialLinksProps {
  socials: SocialLinksType;
}

/**
 * Reusable Social Links bar component displaying Instagram (📸), YouTube (🎥), and Email (✉️) icons.
 */
export function SocialLinks({ socials }: SocialLinksProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {socials.instagram && (
        <a
          href={socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-100 text-[#4E5968] hover:text-[#191F28] hover:bg-gray-50 shadow-sm active:scale-95 transition-all"
          aria-label="Instagram"
          title="인스타그램"
        >
          <Camera className="w-5 h-5" />
        </a>
      )}

      {socials.youtube && (
        <a
          href={socials.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-100 text-[#4E5968] hover:text-[#191F28] hover:bg-gray-50 shadow-sm active:scale-95 transition-all"
          aria-label="YouTube"
          title="유튜브"
        >
          <Video className="w-5 h-5" />
        </a>
      )}

      {socials.email && (
        <a
          href={socials.email.startsWith('mailto:') ? socials.email : `mailto:${socials.email}`}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-100 text-[#4E5968] hover:text-[#191F28] hover:bg-gray-50 shadow-sm active:scale-95 transition-all"
          aria-label="Email"
          title="이메일 문의"
        >
          <Mail className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}

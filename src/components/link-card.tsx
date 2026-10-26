import { Card } from '@/components/ui/card';
import { LinkItem } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import { LinkIcon } from '@/components/link-icon';

interface LinkCardProps {
  link: LinkItem;
}

/**
 * Reusable Link Button Card component matching the wireframe:
 * - Left: Dynamic Platform Logo (YouTube, Google, Blog, etc.) + Title (Bold) + Subtitle/Description
 * - Right: Chevron arrow (>)
 * - Style: Toss TDS rounded-2xl white card with Tailwind CSS
 */
export function LinkCard({ link }: LinkCardProps) {
  const href = link.url.startsWith('http') || link.url.startsWith('mailto:') 
    ? link.url 
    : `https://${link.url}`;

  return (
    <Card className="group rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md hover:border-gray-200 active:scale-[0.99] transition-all duration-200 cursor-pointer overflow-hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3.5 p-3.5 sm:p-4 w-full text-left"
      >
        {/* Dynamic Platform / Domain Logo */}
        <LinkIcon url={link.url} title={link.title} className="w-11 h-11 group-hover:scale-105 transition-transform duration-200" size={22} />

        {/* Text Details */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-[15px] font-bold text-[#191F28] leading-snug truncate group-hover:text-blue-600 transition-colors">
            {link.title}
          </span>
          {link.description && (
            <span className="text-[13px] text-[#4E5968] leading-tight line-clamp-1">
              {link.description}
            </span>
          )}
        </div>

        {/* Action Icon */}
        <div className="p-1.5 rounded-full text-[#B0B8C1] group-hover:text-[#4E5968] group-hover:bg-gray-100 transition-all shrink-0">
          <ChevronRight className="h-4.5 w-4.5" />
        </div>
      </a>
    </Card>
  );
}

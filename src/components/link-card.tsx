import { Card } from '@/components/ui/card';
import { LinkItem } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface LinkCardProps {
  link: LinkItem;
}

/**
 * Reusable Link Button Card component matching the wireframe:
 * - Left: Title (Bold) + Subtitle/Description
 * - Right: Arrow icon (→)
 * - Style: Toss TDS rounded-2xl white card with Tailwind CSS
 */
export function LinkCard({ link }: LinkCardProps) {
  const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-sm hover:bg-gray-50/70 active:scale-[0.99] transition-all duration-150 cursor-pointer overflow-hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 sm:p-4.5 w-full text-left"
      >
        <div className="flex flex-col gap-1 min-w-0 pr-2">
          <span className="text-[15px] font-bold text-[#191F28] leading-snug truncate">
            {link.title}
          </span>
          {link.description && (
            <span className="text-[13px] text-[#4E5968] leading-tight line-clamp-2">
              {link.description}
            </span>
          )}
        </div>
        <ArrowRight className="h-4.5 w-4.5 text-[#8B95A1] shrink-0 ml-2" />
      </a>
    </Card>
  );
}

import { Card } from '@/components/ui/card';
import { LinkItem } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface LinkCardProps {
  link: LinkItem;
}

/**
 * Reusable link card — matches wireframe "Link Button Card" design.
 * Shows icon+title on the left, optional description below, arrow on the right.
 */
export function LinkCard({ link }: LinkCardProps) {
  const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
  return (
    <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-gray-900 leading-tight">
            {link.title}
          </span>
          {link.description && (
            <span className="text-[13px] text-gray-500 leading-snug">
              {link.description}
            </span>
          )}
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 shrink-0 ml-3" />
      </a>
    </Card>
  );
}

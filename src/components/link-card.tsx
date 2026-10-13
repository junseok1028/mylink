import { Card } from '@/components/ui/card';
import { LinkItem } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface LinkCardProps {
  link: LinkItem;
}

/**
 * Reusable Link Card component built on shadcn/ui Card with Toss TDS styling (Tailwind CSS).
 */
export function LinkCard({ link }: LinkCardProps) {
  const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:bg-gray-50/80 active:scale-[0.98] transition-all duration-150 cursor-pointer overflow-hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4.5 sm:p-5 w-full text-left"
      >
        <span className="text-[15px] sm:text-[16px] font-semibold text-[#191F28] leading-snug">
          {link.title}
        </span>
        <ExternalLink className="h-4.5 w-4.5 text-gray-400 shrink-0 ml-3" />
      </a>
    </Card>
  );
}

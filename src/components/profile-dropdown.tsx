'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '@base-ui/react/menu';
import {
  Link2,
  ExternalLink,
  UserCheck,
  Settings,
  PlusCircle,
  RefreshCw,
  LogOut,
  Check,
  ChevronDown,
} from 'lucide-react';
import { type User } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface ProfileDropdownProps {
  user: User;
  displayName: string;
  avatarUrl?: string;
  onCopyLink: () => void;
  onOpenEdit: () => void;
  onAddLink: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing?: boolean;
}

export function ProfileDropdown({
  user,
  displayName,
  avatarUrl,
  onCopyLink,
  onOpenEdit,
  onAddLink,
  onRefresh,
  onLogout,
  isRefreshing,
}: ProfileDropdownProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  const profilePath = `/${encodeURIComponent(displayName)}`;

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${profilePath}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      onCopyLink();
    }
  };

  const handleNavigateToProfile = () => {
    router.push(profilePath);
  };

  const handleOpenProfileInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(profilePath, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        className="flex items-center gap-1.5 p-1 pl-1.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="사용자 프로필 메뉴"
      >
        <span className="text-xs font-semibold text-[#191F28] max-w-[80px] sm:max-w-[100px] truncate">
          {displayName}님
        </span>
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-100 shadow-2xs"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center ring-2 ring-gray-100 shadow-2xs">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#8B95A1]" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={6} className="z-50">
          <Menu.Popup className="w-56 rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 outline-none text-xs text-[#191F28] transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {/* Header: User Info */}
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <p className="font-bold text-sm text-[#191F28] truncate">{displayName}</p>
              <p className="text-[11px] text-[#8B95A1] truncate mt-0.5" title={user.email || ''}>
                {user.email || 'Google 계정'}
              </p>
            </div>

            {/* Menu Items */}
            {/* 1. 개인별 페이지 이동 */}
            <Menu.Item
              onClick={handleNavigateToProfile}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50/70 hover:bg-blue-100/70 cursor-pointer outline-none transition-colors"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>내 프로필 페이지로 이동</span>
            </Menu.Item>

            {/* 2. 새 탭에서 열기 */}
            <Menu.Item
              onClick={handleOpenProfileInNewTab}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-100 cursor-pointer outline-none transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#8B95A1]" />
              <span>새 탭에서 내 페이지 보기</span>
            </Menu.Item>

            {/* 3. 내 프로필 링크 복사 */}
            <Menu.Item
              onClick={handleCopy}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-50 hover:text-blue-600 cursor-pointer outline-none transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Link2 className="w-4 h-4 text-[#8B95A1]" />
              )}
              <span>{copied ? '링크 복사 완료!' : '내 프로필 링크 복사'}</span>
            </Menu.Item>

            <div className="h-px bg-gray-100 my-1" />

            {/* 4. 프로필 및 링크 설정 */}
            <Menu.Item
              onClick={onOpenEdit}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-100 cursor-pointer outline-none transition-colors"
            >
              <Settings className="w-4 h-4 text-[#8B95A1]" />
              <span>프로필 및 링크 설정</span>
            </Menu.Item>

            {/* 5. 새 링크 추가 */}
            <Menu.Item
              onClick={onAddLink}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-100 cursor-pointer outline-none transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#8B95A1]" />
              <span>새 링크 추가</span>
            </Menu.Item>

            {/* 6. 최신 데이터 동기화 */}
            <Menu.Item
              onClick={onRefresh}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-gray-100 cursor-pointer outline-none transition-colors"
            >
              <RefreshCw
                className={cn('w-4 h-4 text-[#8B95A1]', isRefreshing && 'animate-spin text-blue-600')}
              />
              <span>최신 데이터 동기화</span>
            </Menu.Item>

            <div className="h-px bg-gray-100 my-1" />

            {/* 7. 로그아웃 */}
            <Menu.Item
              onClick={onLogout}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer outline-none transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>로그아웃</span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, getEmailPrefix } from '@/lib/auth-context';
import {
  getUserStatsLinks,
  getUserProfileFromFirestore,
  addLinkToFirestore,
  saveUserProfileWithDisplayName,
} from '@/lib/firestore-links';
import { LinkItem, Profile } from '@/lib/types';
import { LinkIcon } from '@/components/link-icon';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { AddLinkDialog } from '@/components/add-link-dialog';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import {
  BarChart3,
  MousePointerClick,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Award,
  Layers,
  Sparkles,
  Loader2,
  PieChart as PieIcon,
  Share2,
  Copy,
  Check,
  Globe,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { toast } from 'sonner';

const CHART_COLORS = [
  '#3182F6', // Toss Blue
  '#4F46E5', // Indigo
  '#7C3AED', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
];

const barChartConfig = {
  clickCount: {
    label: '클릭수',
    color: '#3182F6',
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading: authLoading, displayName, logout } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 1. 로그인 필수: 비로그인 시 메인 페이지('/')로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('통계 페이지는 로그인이 필요합니다.');
      router.replace('/');
    }
  }, [authLoading, user, router]);

  // 2. Firestore에서 orderBy('clickCount', 'desc') 적용된 링크 목록 조회
  const {
    data: links = [],
    isLoading: isLinksLoading,
    refetch,
  } = useQuery<LinkItem[]>({
    queryKey: ['stats-links', user?.uid],
    queryFn: () => getUserStatsLinks(user!.uid),
    enabled: !!user?.uid,
  });

  // 프로필 정보 조회
  const { data: profile } = useQuery<Profile | null>({
    queryKey: ['profile', user?.uid],
    queryFn: () => getUserProfileFromFirestore(user!.uid),
    enabled: !!user?.uid,
  });

  const effectiveDisplayName = profile?.display_name || displayName || (user ? getEmailPrefix(user) : '사용자');

  // 3. 통계 계산 (총 클릭수, 최고 인기 링크, 평균 클릭수, 섹션별 통계)
  // - 총 클릭수: 모든 링크의 클릭수 합산
  const totalClicks = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.clickCount ?? link.clicks ?? 0), 0);
  }, [links]);

  const activeLinks = useMemo(() => links.filter((l) => l.is_active !== false), [links]);
  const activeLinksCount = activeLinks.length;

  const topLink = useMemo(() => {
    if (!links.length) return null;
    return links[0]; // orderBy('clickCount', 'desc') 정렬
  }, [links]);

  const averageClicks = useMemo(() => {
    if (!links.length) return '0.0';
    return (totalClicks / links.length).toFixed(1);
  }, [totalClicks, links.length]);

  // 차트 데이터 1: 상위 8개 링크별 클릭 수
  const barChartData = useMemo(() => {
    return links.slice(0, 8).map((link, idx) => ({
      name: link.title.length > 9 ? `${link.title.slice(0, 9)}…` : link.title,
      fullName: link.title,
      clickCount: link.clickCount ?? link.clicks ?? 0,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }));
  }, [links]);

  // 차트 데이터 2: 섹션(카테고리)별 클릭 분포
  const sectionChartData = useMemo(() => {
    const sectionMap: Record<string, number> = {};
    links.forEach((link) => {
      const sec = link.section || '기타';
      const clicks = link.clickCount ?? link.clicks ?? 0;
      sectionMap[sec] = (sectionMap[sec] || 0) + clicks;
    });

    return Object.entries(sectionMap)
      .map(([name, value], idx) => ({
        name,
        value,
        fill: CHART_COLORS[idx % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [links]);

  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    sectionChartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
    return config;
  }, [sectionChartData]);

  // 상단 액션 핸들러
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['stats-links', user?.uid] });
      await queryClient.invalidateQueries({ queryKey: ['links', user?.uid] });
      toast.success('통계 데이터가 최신으로 갱신되었습니다. ✨');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${encodeURIComponent(effectiveDisplayName)}`;
      navigator.clipboard.writeText(url);
      toast.success('내 프로필 링크가 클립보드에 복사되었어요! 🔗');
    }
  };

  const handleCopyLinkUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('링크 URL이 복사되었습니다.');
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
      router.replace('/');
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleAddNewLink = async (
    newLinkData: Omit<LinkItem, 'id' | 'is_active' | 'display_order'>
  ) => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      await addLinkToFirestore(user.uid, {
        ...newLinkData,
        is_active: true,
        display_order: links.length + 1,
      });
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
      toast.success(`'${newLinkData.title}' 링크가 추가되었어요! ✨`);
    } catch (err) {
      console.error(err);
      toast.error('링크 추가 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveProfile = async (updated: Profile, updatedLinks: LinkItem[]) => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      await saveUserProfileWithDisplayName(user.uid, updated, profile?.display_name);
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['profile', user.uid] });
      await queryClient.invalidateQueries({ queryKey: ['links', user.uid] });
      await queryClient.invalidateQueries({ queryKey: ['stats-links', user.uid] });
      toast.success('프로필 정보가 저장되었습니다! ✨');
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 로딩 화면
  if (authLoading || (user && isLinksLoading)) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50/30 via-white to-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse shadow-sm">
            <BarChart3 className="w-6 h-6 animate-bounce" />
          </div>
          <p className="text-sm font-semibold text-[#191F28]">통계 분석 데이터를 불러오는 중...</p>
          <p className="text-xs text-[#8B95A1]">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  // 비로그인 상태는 리다이렉트 처리 대기
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F2F6FC]/60 via-[#F9FAFB] to-[#F9FAFB] text-[#191F28] flex flex-col items-center">
      {/* ── 1. 최상단 고정 헤더 (로고 클릭 시 루트 이동 / 내 페이지 & 통계는 프로필 드롭다운에만 위치) ── */}
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-gray-100/90 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          
          {/* 헤더 좌측: MyLink 브랜드 로고 (클릭 시 루트 '/' 페이지로 이동) */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
              title="홈으로 이동"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs group-hover:scale-105 group-hover:bg-blue-700 transition-all">
                M
              </div>
              <span className="text-[15px] font-extrabold text-[#191F28] tracking-tight group-hover:text-blue-600 transition-colors">
                MyLink
              </span>
            </Link>

            {isRefreshing && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                동기화 중
              </span>
            )}
          </div>

          {/* 헤더 우측: 액션 버튼들 & 프로필 드롭다운 (내 페이지, 통계는 드롭다운 내부에만 위치) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 프로필 공유 버튼 */}
            <button
              onClick={handleShareProfile}
              className="p-1.5 rounded-full text-[#4E5968] hover:text-[#191F28] hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
              aria-label="프로필 공유하기"
              title="프로필 링크 복사 및 공유"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* 새로고침 버튼 */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-full text-[#4E5968] hover:text-[#191F28] hover:bg-gray-100 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              aria-label="새로고침"
              title="통계 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* 사용자 프로필 드롭다운 (내 페이지, 통계 대시보드, 설정, 링크 추가 등 지원) */}
            <ProfileDropdown
              user={user}
              displayName={effectiveDisplayName}
              avatarUrl={profile?.avatar_url || user.photoURL || undefined}
              onCopyLink={handleShareProfile}
              onOpenEdit={() => setIsEditDialogOpen(true)}
              onAddLink={() => setIsAddDialogOpen(true)}
              onRefresh={handleRefresh}
              onLogout={handleLogout}
              isRefreshing={isRefreshing}
            />
          </div>
        </div>

        {/* 동기화 진행 프로그레스 바 */}
        {isRefreshing && (
          <div className="h-0.5 w-full bg-blue-100 overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse w-full" />
          </div>
        )}
      </header>

      {/* ── Main Container ── */}
      <main className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">

        {/* ── Page Title & Subtitle Banner ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-xs border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#191F28] tracking-tight">
                통계 대시보드
              </h1>
              <p className="text-xs sm:text-[13px] text-[#6B7684] mt-0.5">
                <strong className="text-[#191F28] font-semibold">{effectiveDisplayName}</strong>님의 링크 클릭 성과와 방문자 반응을 한눈에 확인하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-[#333D4B] transition-all shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8B95A1]" />
              <span>링크 편집으로</span>
            </Link>
          </div>
        </div>

        {/* ── 2. KPI Summary Cards (이쁘고 직관적인 핵심 지표 4선) ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* (1) 총 클릭수 (모든 링크 합산) - 요구사항 핵심 강조 */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-linear-to-br from-blue-50 via-white to-white p-5 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">
                총 클릭수
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-black text-[#191F28] tracking-tight">
                {totalClicks.toLocaleString()}
              </span>
              <span className="text-xs text-[#8B95A1] ml-1.5 font-semibold">회</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              <Flame className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>모든 등록 링크 누적 합산</span>
            </div>
          </div>

          {/* (2) 최고 인기 링크 (Top 1) */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-200/70 bg-linear-to-br from-amber-50/60 via-white to-white p-5 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 tracking-wide uppercase">
                최고 인기 링크
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[15px] font-bold text-[#191F28] truncate leading-tight" title={topLink?.title || '없음'}>
                {topLink ? topLink.title : '등록된 링크 없음'}
              </p>
              <p className="text-xs font-extrabold text-amber-600 mt-1">
                {topLink ? `${(topLink.clickCount ?? topLink.clicks ?? 0).toLocaleString()}회 클릭` : '0회'}
              </p>
            </div>
            <p className="mt-2 text-[11px] text-[#8B95A1] font-medium">1위 링크 점유율 👑</p>
          </div>

          {/* (3) 링크당 평균 클릭수 */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-linear-to-br from-emerald-50/50 via-white to-white p-5 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 tracking-wide uppercase">
                평균 클릭수
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-black text-[#191F28] tracking-tight">
                {averageClicks}
              </span>
              <span className="text-xs text-[#8B95A1] ml-1.5 font-semibold">회</span>
            </div>
            <p className="mt-2 text-[11px] text-[#8B95A1] font-medium">링크 1개당 평균 성과</p>
          </div>

          {/* (4) 활성 / 전체 링크 수 */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-200/70 bg-linear-to-br from-purple-50/50 via-white to-white p-5 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 tracking-wide uppercase">
                활성 링크
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-black text-[#191F28] tracking-tight">
                {activeLinksCount}
              </span>
              <span className="text-xs text-[#8B95A1] ml-1.5 font-semibold">/ {links.length}개</span>
            </div>
            <p className="mt-2 text-[11px] text-[#8B95A1] font-medium">
              비활성 링크: {links.length - activeLinksCount}개
            </p>
          </div>
        </section>

        {/* ── 3. Charts Section (shadcn 차트 컴포넌트 활용) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 차트 1: 링크별 클릭수 막대 차트 (BarChart) - 상위 8개 */}
          <Card className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white shadow-xs p-1">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#191F28] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    링크별 클릭 수 랭킹 (Top 8)
                  </CardTitle>
                  <CardDescription className="text-xs text-[#8B95A1] mt-0.5">
                    클릭 수가 많은 상위 링크 순위입니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
              {barChartData.length === 0 ? (
                <div className="h-72 flex flex-col items-center justify-center text-center text-[#8B95A1] text-xs">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
                    <MousePointerClick className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-600">아직 등록된 링크가 없습니다</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">새 링크를 등록하면 차트가 자동으로 생성됩니다.</span>
                </div>
              ) : (
                <ChartContainer config={barChartConfig} className="h-72 w-full">
                  <BarChart
                    data={barChartData}
                    layout="vertical"
                    margin={{ top: 8, right: 28, left: 24, bottom: 8 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#F2F4F6" />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={11}
                      stroke="#8B95A1"
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={11}
                      stroke="#333D4B"
                      width={86}
                    />
                    <ChartTooltip
                      cursor={{ fill: 'rgba(242, 244, 246, 0.7)' }}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar
                      dataKey="clickCount"
                      radius={[0, 8, 8, 0]}
                      barSize={18}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* 차트 2: 섹션별 클릭 점유율 도넛 차트 (Donut / PieChart) */}
          <Card className="rounded-3xl border border-gray-100 bg-white shadow-xs p-1 flex flex-col">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-bold text-[#191F28] flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-600" />
                섹션별 클릭 점유율
              </CardTitle>
              <CardDescription className="text-xs text-[#8B95A1] mt-0.5">
                카테고리별 누적 반응 비중
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 flex-1 flex flex-col items-center justify-center">
              {sectionChartData.length === 0 || totalClicks === 0 ? (
                <div className="h-72 flex flex-col items-center justify-center text-center text-[#8B95A1] text-xs">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
                    <PieIcon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-600">클릭 데이터 대기 중</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">방문자 클릭이 발생하면 점유율이 시각화됩니다.</span>
                </div>
              ) : (
                <ChartContainer config={pieChartConfig} className="h-72 w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <Pie
                      data={sectionChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {sectionChartData.map((entry, index) => (
                        <Cell key={`pie-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={
                        <ChartLegendContent
                          nameKey="name"
                          className="-translate-y-2 flex-wrap gap-2 text-[11px]"
                        />
                      }
                    />
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── 4. Detailed Links Table (전체 링크 상세 클릭 현황) ── */}
        <section className="mt-1">
          <Card className="rounded-3xl border border-gray-100 bg-white shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/40">
              <div>
                <h2 className="text-base font-extrabold text-[#191F28]">전체 링크별 클릭 현황</h2>
                <p className="text-xs text-[#8B95A1] mt-0.5">
                  총 <span className="font-bold text-blue-600">{links.length}</span>개 링크가 클릭 순서대로 정렬되어 있습니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-2xs">
                  전체 누적 클릭 {totalClicks.toLocaleString()}회
                </span>
              </div>
            </div>

            {links.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#8B95A1] flex flex-col items-center">
                <Globe className="w-10 h-10 text-gray-200 mb-2" />
                <span className="font-semibold text-gray-600">등록된 링크가 없습니다.</span>
                <p className="text-[11px] text-gray-400 mt-1">
                  메인 페이지에서 새로운 링크를 등록하고 분석해보세요.
                </p>
                <Link
                  href="/"
                  className="mt-3 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
                >
                  새 링크 추가하러 가기
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {links.map((link, idx) => {
                  const clickCount = link.clickCount ?? link.clicks ?? 0;
                  const percentage = totalClicks > 0 ? ((clickCount / totalClicks) * 100).toFixed(1) : '0';
                  const isFirstRank = idx === 0 && clickCount > 0;
                  const isCopied = copiedId === link.id;

                  return (
                    <div
                      key={link.id}
                      className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Left: 순위 뱃지 + 파비콘 아이콘 + 제목 및 URL */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Rank Badge */}
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 shadow-2xs ${
                            isFirstRank
                              ? 'bg-amber-400 text-white ring-2 ring-amber-300 shadow-amber-200'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-800'
                              : idx === 2
                              ? 'bg-amber-700/80 text-white'
                              : 'bg-gray-100 text-[#8B95A1]'
                          }`}
                        >
                          {isFirstRank ? '👑' : idx + 1}
                        </div>

                        {/* Link Favicon Icon */}
                        <LinkIcon url={link.url} title={link.title} className="w-10 h-10 shrink-0" size={20} />

                        {/* Title and Section */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#191F28] truncate group-hover:text-blue-600 transition-colors">
                              {link.title}
                            </span>
                            <span className="text-[10px] text-[#6B7684] bg-gray-100 px-1.5 py-0.5 rounded-md font-medium shrink-0">
                              {link.section || '기타'}
                            </span>
                            {!link.is_active && (
                              <span className="text-[10px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded shrink-0">
                                비활성
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a
                              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#8B95A1] hover:text-blue-600 truncate flex items-center gap-1 transition-colors"
                              title={link.url}
                            >
                              <span className="truncate">{link.url}</span>
                              <ArrowUpRight className="w-3 h-3 shrink-0 opacity-70" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right: 점유율 바 + 총 클릭수 + URL 복사 퀵 액션 */}
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Progress bar (Desktop) */}
                        <div className="w-28 hidden sm:block">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-[#8B95A1]">점유율</span>
                            <span className="font-bold text-[#191F28]">{percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Click Count Value */}
                        <div className="min-w-[70px] text-right">
                          <span className="text-base sm:text-lg font-black text-[#191F28]">
                            {clickCount.toLocaleString()}
                          </span>
                          <span className="text-xs text-[#8B95A1] ml-0.5 font-medium">회</span>
                        </div>

                        {/* Quick Copy URL Button */}
                        <button
                          onClick={() => handleCopyLinkUrl(link.id, link.url)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="링크 URL 복사"
                          aria-label="링크 복사"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </section>

      </main>

      {/* ── Dialog Modals (헤더 프로필 드롭다운 메뉴와 완전 연동) ── */}
      {/* 1. 새 링크 추가 다이얼로그 */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddLink={handleAddNewLink}
        defaultSection="🚀 주요 프로젝트 & 포트폴리오"
        existingSections={
          Array.from(new Set(links.map((l) => l.section || '기타'))).length > 0
            ? Array.from(new Set(links.map((l) => l.section || '기타')))
            : ['🚀 주요 프로젝트 & 포트폴리오', '📢 소셜 채널']
        }
      />

      {/* 2. 프로필 편집 다이얼로그 */}
      {user && profile && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userId={user.uid}
          initialProfile={profile}
          initialLinks={links}
          fallbackDisplayName={effectiveDisplayName}
          fallbackAvatarUrl={user.photoURL || ''}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

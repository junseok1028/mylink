// src/app/api/og/route.tsx
// 동적 OG 이미지 생성 (토스 디자인 시스템 기반)

import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const BLUE_500 = '#3182F6';
const BLUE_50  = '#E8F3FF';
const GREY_900 = '#191F28';
const GREY_700 = '#4E5968';
const GREY_500 = '#8B95A1';
const GREY_200 = '#E5E8EB';
const WHITE    = '#FFFFFF';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title')?.slice(0, 60) ?? 'MyLink';
  const type  = (searchParams.get('type') as 'dynamic' | 'static') ?? 'static';

  const LinkIcon = () => (
    <svg
      width="40" height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BLUE_500}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        display: 'flex',
        width: '24px', height: '24px',
        borderRadius: '8px',
        backgroundColor: BLUE_500,
        alignItems: 'center',
        justifyContent: 'center',
        color: WHITE,
        fontSize: '12px',
        fontWeight: 800,
      }}>M</div>
      <span style={{ color: GREY_700, fontSize: '18px', fontWeight: 700 }}>
        MyLink
      </span>
    </div>
  );

  /* ───────────────────────────────────────
     동적 페이지용: 사용자 프로필 OG
  ─────────────────────────────────────── */
  if (type === 'dynamic') {
    return new ImageResponse(
      (
        <div style={{
          width: '1200px', height: '630px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: '#F9FAFB',
          fontFamily: 'sans-serif',
          padding: '56px 80px 48px',
        }}>
          {/* 상단 로고 */}
          <Logo />

          {/* 중앙 카드 */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: WHITE,
            borderRadius: '28px',
            padding: '52px 80px',
            boxShadow: '0 12px 32px rgba(14,22,44,0.08)',
            border: `1px solid ${GREY_200}`,
            width: '720px',
          }}>
            {/* 아이콘 */}
            <div style={{
              display: 'flex',
              width: '72px', height: '72px',
              borderRadius: '22px',
              backgroundColor: BLUE_50,
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '24px',
            }}>
              <LinkIcon />
            </div>

            {/* 배지 */}
            <div style={{
              display: 'flex',
              backgroundColor: BLUE_50,
              color: BLUE_500,
              fontSize: '18px', fontWeight: 600,
              borderRadius: '999px',
              padding: '6px 18px',
              marginBottom: '20px',
            }}>
              MyLink 프로필
            </div>

            {/* 사용자 이름 */}
            <div style={{
              display: 'flex',
              color: GREY_900,
              fontSize: '58px', fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              {title}
            </div>

            {/* 서브텍스트 */}
            <div style={{
              display: 'flex',
              color: GREY_500,
              fontSize: '22px', fontWeight: 500,
              textAlign: 'center',
            }}>
              포트폴리오 · 소셜 · 블로그를 한 곳에
            </div>
          </div>

          {/* 하단 도메인 */}
          <div style={{
            display: 'flex',
            color: GREY_500,
            fontSize: '16px', fontWeight: 500,
          }}>
            mylink.app
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  /* ───────────────────────────────────────
     정적 페이지용: 홈 OG
  ─────────────────────────────────────── */
  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        fontFamily: 'sans-serif',
        padding: '52px 80px 44px',
      }}>
        {/* 상단 로고 */}
        <Logo />

        {/* 중앙 콘텐츠 */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          gap: '0px',
        }}>
          {/* 아이콘 */}
          <div style={{
            display: 'flex',
            width: '80px', height: '80px',
            borderRadius: '26px',
            backgroundColor: BLUE_50,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <svg
              width="40" height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke={BLUE_500}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>

          {/* 배지 */}
          <div style={{
            display: 'flex',
            backgroundColor: BLUE_50,
            color: BLUE_500,
            fontSize: '20px', fontWeight: 600,
            borderRadius: '999px',
            padding: '8px 22px',
            marginBottom: '24px',
          }}>
            나만의 링크 모음 서비스
          </div>

          {/* 타이틀 */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            color: GREY_900,
            fontSize: '68px', fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: 1.15,
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            <span style={{ display: 'flex' }}>나만의 링크를</span>
            <span style={{ display: 'flex' }}>하나의 프로필에</span>
          </div>

          {/* 서브텍스트 */}
          <div style={{
            display: 'flex',
            color: GREY_700,
            fontSize: '24px', fontWeight: 500,
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            포트폴리오, 소셜 채널, 블로그까지 한 곳에 모아보세요
          </div>

          {/* 태그 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['바이오 링크', 'Google 로그인', '방문자 통계'].map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  backgroundColor: WHITE,
                  border: `1px solid ${GREY_200}`,
                  borderRadius: '999px',
                  padding: '9px 20px',
                  color: GREY_700,
                  fontSize: '18px', fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 도메인 */}
        <div style={{
          display: 'flex',
          color: GREY_500,
          fontSize: '16px', fontWeight: 500,
        }}>
          mylink.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

'use client';

import './toss.css';
import Image from 'next/image';
import { useState } from 'react';

export default function Page() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ahnjs4291@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const techStack = [
    'Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS',
    'Node.js', 'Git & GitHub', 'Clean Architecture', 'Responsive UI',
  ];

  const values = [
    {
      num: '01',
      title: '문제 해결 중심',
      en: 'Problem Solver',
      desc: '단순한 코드 타이핑을 넘어 본질적인 사용자의 불편과 비즈니스 문제를 집요하게 파고들어 해결해요.',
    },
    {
      num: '02',
      title: '직관적인 사용자 경험',
      en: 'Intuitive UX',
      desc: '디테일한 인터랙션과 타협 없는 사용성을 통해 누구나 즐겁고 직관적으로 쓸 수 있는 화면을 만들어요.',
    },
    {
      num: '03',
      title: '지속 가능한 클린 코드',
      en: 'Clean Code',
      desc: '가독성과 확장성을 최우선으로 고려하며, 동료와 미래의 내가 이해하기 쉬운 견고한 구조를 구축해요.',
    },
  ];

  return (
    <div className="tds-wrapper">

      {/* ── TopBar ── */}
      <header className="tds-topbar">
        <div className="tds-topbar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://getdesign.kr/logos/toss.png" alt="logo" />
          <span className="tds-topbar-title">안준석 · 포트폴리오</span>
        </div>
        <span className="tds-chip tds-chip-brand">Software Engineer</span>
      </header>

      {/* ── Main card ── */}
      <main className="tds-card">

        {/* Banner */}
        <div className="tds-banner">
          <Image
            src="/banner.jpg"
            alt="프로필 배너"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Body */}
        <div className="tds-body">

          {/* Avatar + CTA */}
          <div className="tds-avatar-row">
            <div className="tds-avatar">
              <Image
                src="/avatar.jpg"
                alt="안준석 프로필 사진"
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="tds-actions">
              <a
                href="https://github.com/junseok1028"
                target="_blank"
                rel="noopener noreferrer"
                className="tds-btn tds-btn-secondary"
              >
                GitHub
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="tds-btn tds-btn-primary"
              >
                이메일 복사하기
              </button>
            </div>
          </div>

          {/* Name & location */}
          <h1 className="tds-name">안준석</h1>
          <p className="tds-name-en">Junseok Ahn</p>
          <p className="tds-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.67"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21c-4-4-8-7.5-8-12A8 8 0 0 1 20 9c0 4.5-4 8-8 12z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            서울, 대한민국 · 프론트엔드 &amp; 풀스택 개발자
          </p>

          {/* Bio */}
          <div className="tds-bio">
            <p className="tds-bio-quote">
              &quot;문제를 정의하고 코드로 가치를 만들어가는 개발자예요.&quot;
            </p>
            <p className="tds-bio-body">
              사용자 중심의 직관적인 경험과 지속 가능한 클린 코드를 지향하며,
              기술의 한계를 넘어 창의적인 웹 서비스를 만들어요.
            </p>
          </div>

          <div className="tds-divider" />

          {/* Core Values */}
          <p className="tds-section-label">핵심 가치</p>
          <div className="tds-values-grid">
            {values.map((v) => (
              <div key={v.num} className="tds-value-card">
                <p className="tds-value-num">{v.num}</p>
                <p className="tds-value-title">{v.title}</p>
                <p className="tds-value-ko">{v.en}</p>
                <p className="tds-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="tds-divider" />

          {/* Tech stack */}
          <p className="tds-section-label">기술 스택</p>
          <div className="tds-chips-row">
            {techStack.map((tech) => (
              <span key={tech} className="tds-chip">{tech}</span>
            ))}
          </div>

          <div className="tds-divider" />

          {/* Projects */}
          <p className="tds-section-label">프로젝트 &amp; 링크</p>
          <div>
            <a
              href="https://github.com/junseok1028/mylink"
              target="_blank"
              rel="noopener noreferrer"
              className="tds-list-row"
            >
              <div className="tds-list-avatar">🔗</div>
              <div className="tds-list-text">
                <p className="tds-list-title">mylink</p>
                <p className="tds-list-sub">
                  Next.js &amp; Tailwind CSS 기반 반응형 프로필 &amp; 링크 큐레이션
                </p>
              </div>
              <span className="tds-list-arrow">›</span>
            </a>
            <a
              href="https://github.com/junseok1028"
              target="_blank"
              rel="noopener noreferrer"
              className="tds-list-row"
            >
              <div className="tds-list-avatar">💻</div>
              <div className="tds-list-text">
                <p className="tds-list-title">GitHub · @junseok1028</p>
                <p className="tds-list-sub">
                  오픈소스 기여 및 지속적으로 커밋 중인 개발 프로젝트 아카이브
                </p>
              </div>
              <span className="tds-list-arrow">›</span>
            </a>
          </div>

          {/* Contact */}
          <div className="tds-contact">
            <div>
              <p className="tds-contact-label">연락하기</p>
              <p className="tds-contact-title">같이 만들어볼까요?</p>
              <p className="tds-contact-sub">
                새로운 프로젝트 제안, 커피챗, 협업 문의 언제든 환영해요.
              </p>
            </div>
            <a
              href="mailto:ahnjs4291@gmail.com"
              className="tds-btn tds-btn-primary"
            >
              이메일 보내기
            </a>
          </div>

          {/* Footer */}
          <footer className="tds-footer">
            <div>
              <span className="tds-footer-dot" />
              ahnjs4291@gmail.com
            </div>
            <div>© 2026 Junseok Ahn</div>
          </footer>

        </div>
      </main>

      {/* Toast */}
      <div className={`tds-toast${copied ? ' show' : ''}`}>
        <span className="tds-toast-icon">✓</span>
        이메일 주소를 복사했어요
      </div>

    </div>
  );
}

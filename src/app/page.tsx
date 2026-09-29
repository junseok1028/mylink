"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ahnjs4291@gmail.com");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const techStack = [
    { name: "Next.js 16", bg: "bg-[#ffffff]", text: "text-black", rotate: "rotate-[-2deg]" },
    { name: "React 19", bg: "bg-[#61dafb]", text: "text-black", rotate: "rotate-[2deg]" },
    { name: "TypeScript", bg: "bg-[#3178c6]", text: "text-white", rotate: "rotate-[-1deg]" },
    { name: "Tailwind CSS", bg: "bg-[#38bdf8]", text: "text-black", rotate: "rotate-[3deg]" },
    { name: "Turbopack", bg: "bg-[#ff5722]", text: "text-white", rotate: "rotate-[-3deg]" },
    { name: "Node.js", bg: "bg-[#22c55e]", text: "text-black", rotate: "rotate-[1deg]" },
    { name: "Git & GitHub", bg: "bg-[#f43f5e]", text: "text-white", rotate: "rotate-[-2deg]" },
    { name: "Clean Architecture", bg: "bg-[#a855f7]", text: "text-white", rotate: "rotate-[2deg]" },
    { name: "Responsive UI", bg: "bg-[#ffde59]", text: "text-black", rotate: "rotate-[-1deg]" },
  ];

  const values = [
    {
      num: "01",
      icon: "🎯",
      title: "PROBLEM SOLVER",
      koreanTitle: "문제 해결 중심",
      desc: "단순한 코드 타이핑을 넘어 본질적인 사용자의 불편과 비즈니스 문제를 집요하게 파고들어 해결합니다.",
      bg: "bg-[#ff70a6]",
    },
    {
      num: "02",
      icon: "💡",
      title: "INTUITIVE UX",
      koreanTitle: "직관적인 사용자 경험",
      desc: "디테일한 인터랙션과 타협 없는 사용성을 통해 누구나 즐겁고 직관적으로 쓸 수 있는 화면을 만듭니다.",
      bg: "bg-[#ffd166]",
    },
    {
      num: "03",
      icon: "⚡",
      title: "CLEAN CODE",
      koreanTitle: "지속 가능한 클린 코드",
      desc: "가독성과 확장성을 최우선으로 고려하며, 동료와 미래의 내가 감탄할 수 있는 견고한 구조를 구축합니다.",
      bg: "bg-[#06d6a0]",
    },
  ];

  return (
    <div className="min-h-screen py-6 sm:py-12 md:py-16 px-3 sm:px-6 flex flex-col items-center justify-center font-sans">
      {/* NeoBrutalist Main Window Container */}
      <main className="w-full max-w-3xl bg-[#ffffff] border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] sm:shadow-[10px_10px_0px_0px_#000] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200">
        
        {/* Retro GUI Window Title Bar */}
        <div className="bg-[#ffe600] border-b-3 sm:border-b-4 border-black px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#ff5f56] border-2 border-black inline-block shadow-[1px_1px_0px_0px_#000]" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#ffbd2e] border-2 border-black inline-block shadow-[1px_1px_0px_0px_#000]" />
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#27c93f] border-2 border-black inline-block shadow-[1px_1px_0px_0px_#000]" />
          </div>
          
          <div className="font-mono font-black text-[11px] sm:text-sm tracking-wider uppercase text-black flex items-center gap-1 sm:gap-2 truncate max-w-[200px] sm:max-w-none">
            <span>💾 JUNSEOK_OS</span>
            <span className="hidden sm:inline">// PORTFOLIO_V2.0</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
            <span className="bg-black text-[#ffe600] px-2 py-0.5 rounded border border-black text-[10px] sm:text-xs">
              PRO
            </span>
          </div>
        </div>

        {/* Marquee Ticker Bar */}
        <div className="bg-[#00f0ff] border-b-3 sm:border-b-4 border-black py-2 sm:py-2.5 overflow-hidden whitespace-nowrap text-black font-mono font-black text-xs sm:text-sm tracking-widest uppercase select-none">
          <div className="animate-marquee flex items-center gap-4 sm:gap-6">
            <span>✦ SOFTWARE ENGINEER</span>
            <span>★ NEO-BRUTALISM EDITION</span>
            <span>✦ PROBLEM SOLVER</span>
            <span>★ NEXT.JS 16 & TYPESCRIPT</span>
            <span>✦ CLEAN CODE & INTUITIVE UX</span>
            <span>★ SEOUL, SOUTH KOREA</span>
            <span>✦ READY FOR COLLABORATION</span>
            {/* Repeat for seamless continuous loop */}
            <span>✦ SOFTWARE ENGINEER</span>
            <span>★ NEO-BRUTALISM EDITION</span>
            <span>✦ PROBLEM SOLVER</span>
            <span>★ NEXT.JS 16 & TYPESCRIPT</span>
            <span>✦ CLEAN CODE & INTUITIVE UX</span>
            <span>★ SEOUL, SOUTH KOREA</span>
            <span>✦ READY FOR COLLABORATION</span>
          </div>
        </div>

        {/* Hero Cover Banner Area */}
        <div className="relative h-44 xs:h-52 sm:h-64 w-full border-b-3 sm:border-b-4 border-black overflow-hidden bg-[#ffde59]">
          <Image
            src="/banner.jpg"
            alt="NeoBrutalist Cover Banner"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />

          {/* Floating Sticker Top Left */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="inline-block bg-[#ff5e7e] text-white font-black text-[10px] xs:text-xs sm:text-sm px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-lg border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] rotate-[-3deg] uppercase tracking-wider">
              ★ CREATIVE LAB 2026
            </span>
          </div>

          {/* Floating Sticker Top Right */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#4ade80] text-black font-black text-[10px] xs:text-xs sm:text-sm px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-lg border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] rotate-[2deg] uppercase tracking-wider">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black animate-ping" />
              STATUS: CODING
            </span>
          </div>
        </div>

        {/* Profile Details Area */}
        <div className="p-4 sm:p-8 bg-[#fffdfa]">
          
          {/* Avatar & Quick Action Buttons Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 -mt-16 xs:-mt-20 sm:-mt-24 mb-6 sm:mb-8">
            
            {/* Brutalist Avatar */}
            <div className="relative inline-block self-start">
              <div className="w-28 h-28 xs:w-36 xs:h-36 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] overflow-hidden bg-[#ffe600] rotate-[-2deg] hover:rotate-0 transition-transform duration-200">
                <Image
                  src="/avatar.jpg"
                  alt="안준석 프로필 아바타"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 144px, 160px"
                />
              </div>

              {/* Verified Badge on Avatar */}
              <div className="absolute -bottom-2 -right-2 bg-[#ff5e7e] text-white font-mono font-black text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] rotate-[4deg]">
                ★ DEV VERIFIED
              </div>
            </div>

            {/* Brutalist Action Buttons */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <a
                href="https://github.com/junseok1028"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm uppercase bg-[#00f0ff] hover:bg-[#38bdf8] text-black border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GITHUB VISIT ↗</span>
              </a>

              <button
                onClick={handleCopyEmail}
                type="button"
                className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm uppercase border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer ${
                  copied ? "bg-[#4ade80] text-black" : "bg-[#ffde59] hover:bg-[#fde047] text-black"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>COPY EMAIL ✉</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black tracking-tight text-black">
                안준석
              </h1>
              <span className="font-mono text-xs sm:text-base font-bold text-black/60">
                (Junseok Ahn)
              </span>
              <span className="inline-block bg-[#ffe600] text-black font-black text-[11px] sm:text-sm px-2.5 sm:px-3.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] rotate-[1.5deg] uppercase">
                ⚡ Software Engineer
              </span>
            </div>
            
            <p className="font-mono font-bold text-xs sm:text-sm text-black/70 flex items-center gap-2 flex-wrap">
              <span>📍 SEOUL, KOREA</span>
              <span>//</span>
              <span className="text-[#e11d48]">FRONTEND & FULL-STACK SPECIALIST</span>
            </p>
          </div>

          {/* Bio Introduction Window Box */}
          <div className="relative mb-8 sm:mb-10 bg-white border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] sm:shadow-[7px_7px_0px_0px_#000] rounded-xl sm:rounded-2xl p-4 sm:p-7">
            {/* Tab Sticker */}
            <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-6 bg-black text-[#ffe600] font-mono text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#ffe600] uppercase">
              📄 README.MD
            </div>

            <p className="text-sm xs:text-base sm:text-lg text-black font-bold leading-relaxed break-keep mb-2 mt-1">
              &quot;문제를 정의하고 코드로 가치를 만들어가는 개발자입니다.&quot;
            </p>
            <p className="text-xs xs:text-sm sm:text-base text-black/80 font-medium leading-relaxed break-keep">
              사용자 중심의 직관적인 경험과 지속 가능한 클린 코드를 지향하며, 기술의 한계를 넘어 창의적인 웹 서비스를 완성합니다.
            </p>
          </div>

          {/* Core Philosophy Section */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <h2 className="font-mono font-black text-xs sm:text-base md:text-lg uppercase tracking-wider text-black bg-[#ffde59] px-2.5 sm:px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
                ⚡ 03 CORE VALUES
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {values.map((v, i) => (
                <div
                  key={i}
                  className={`${v.bg} border-2 sm:border-3 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[3px_3px_0px_0px_#000] transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <span className="text-2xl sm:text-3xl">{v.icon}</span>
                      <span className="font-mono font-black text-[10px] sm:text-xs bg-black text-white px-2 py-0.5 rounded border border-black">
                        {v.num}
                      </span>
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-black mb-0.5">
                      {v.title}
                    </h3>
                    <div className="text-[11px] sm:text-xs font-bold text-black/80 mb-2">
                      {v.koreanTitle}
                    </div>
                    <p className="text-xs text-black/90 font-medium leading-relaxed break-keep">
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Arsenal (Tech Stack) */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <h2 className="font-mono font-black text-xs sm:text-base md:text-lg uppercase tracking-wider text-black bg-[#00f0ff] px-2.5 sm:px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] rotate-[1deg]">
                🛠️ TECH ARSENAL
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className={`${tech.bg} ${tech.text} ${tech.rotate} font-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] hover:rotate-0 hover:scale-105 sm:hover:scale-110 transition-all cursor-default select-none`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Projects & Links */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-3.5 sm:mb-4">
              <h2 className="font-mono font-black text-xs sm:text-base md:text-lg uppercase tracking-wider text-black bg-[#ff70a6] text-white px-2.5 sm:px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
                📁 PROJECTS & REPOS
              </h2>
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              {/* mylink Card */}
              <a
                href="https://github.com/junseok1028/mylink"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#fff] border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[4px_4px_0px_0px_#000] rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#ffe600] border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      🔗
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-base sm:text-xl text-black">
                          mylink
                        </span>
                        <span className="bg-[#ff5e7e] text-white font-mono font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded border border-black sm:border-2">
                          FEATURED
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-black/80 font-bold break-keep">
                        Next.js & Tailwind CSS 기반의 반응형 개인 프로필 및 링크 큐레이션 웹
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <span className="inline-flex items-center gap-1.5 bg-[#ffe600] text-black font-black text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:bg-[#fde047]">
                      <span>VIEW REPO</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </a>

              {/* GitHub Profile Card */}
              <a
                href="https://github.com/junseok1028"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#fff] border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[4px_4px_0px_0px_#000] rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#00f0ff] border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      💻
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-base sm:text-xl text-black">
                          GitHub / @junseok1028
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-black/80 font-bold break-keep">
                        오픈소스 기여 및 지속적으로 커밋 중인 다양한 개발 프로젝트 아카이브
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <span className="inline-flex items-center gap-1.5 bg-[#00f0ff] text-black font-black text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:bg-[#38bdf8]">
                      <span>EXPLORE</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Connect & Coffee Chat Callout Banner */}
          <div className="bg-[#c4b5fd] border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] rounded-xl sm:rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="space-y-1">
              <div className="inline-block bg-black text-[#ffe600] font-mono text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded border border-black mb-1">
                CONTACT ME
              </div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-black text-black">
                LET&apos;S BUILD SOMETHING AWESOME!
              </h3>
              <p className="text-xs sm:text-sm text-black/90 font-bold break-keep">
                새로운 프로젝트 제안, 커피챗 또는 협업 문의는 언제든지 환영합니다.
              </p>
            </div>

            <a
              href="mailto:ahnjs4291@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-[#ffe600] font-mono font-black text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#ffffff] sm:shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex-shrink-0 cursor-pointer w-full md:w-auto"
            >
              <span>SEND EMAIL ✉</span>
            </a>
          </div>

          {/* Brutalist Footer */}
          <footer className="border-t-3 sm:border-t-4 border-black pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-3 font-mono font-bold text-[11px] sm:text-xs uppercase text-black text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#4ade80] rounded-full border border-black inline-block" />
              <span>STAMP: VERIFIED ENGINEER 2026</span>
            </div>
            <div>
              © 2026 JUNSEOK AHN // ALL RIGHTS RESERVED
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}

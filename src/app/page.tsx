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
    { name: "Next.js", color: "bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700" },
    { name: "React", color: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800" },
    { name: "TypeScript", color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
    { name: "Tailwind CSS", color: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800" },
    { name: "Node.js", color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    { name: "Git & GitHub", color: "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800" },
    { name: "Turbopack", color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
    { name: "Clean Architecture", color: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "문제 해결 중심",
      desc: "단순한 코드 구현을 넘어 본질적인 사용자의 불편과 비즈니스 문제를 정의하고 해결합니다.",
    },
    {
      icon: "✨",
      title: "직관적인 사용자 경험",
      desc: "디테일한 인터랙션과 직관적인 UI 설계를 통해 사용자에게 쾌적한 디지털 경험을 전달합니다.",
    },
    {
      icon: "⚡",
      title: "지속 가능한 클린 코드",
      desc: "가독성과 확장성을 고려한 아키텍처를 추구하며, 유지보수하기 쉬운 구조를 만듭니다.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 dark:from-[#0a0a0f] dark:via-[#11121c] dark:to-[#0f172a] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 flex flex-col items-center justify-center font-sans antialiased overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 dark:bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-cyan-600/15 blur-[120px] pointer-events-none" />

      {/* Main Profile Card */}
      <main className="w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-950/5 border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-200 dark:bg-zinc-800">
          <Image
            src="/banner.jpg"
            alt="Profile Banner Cover"
            fill
            priority
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/40 dark:bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open for projects
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 sm:px-8 pb-8 pt-0">
          {/* Avatar and Top Actions Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="relative inline-block w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white dark:ring-zinc-900 shadow-2xl overflow-hidden bg-white dark:bg-zinc-800 transition-transform duration-300 hover:scale-105">
              <Image
                src="/avatar.jpg"
                alt="안준석 프로필 이미지"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com/junseok1028"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-slate-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>

              <button
                onClick={handleCopyEmail}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 transition-all duration-200 shadow-sm"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">복사됨!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-slate-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>이메일 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                안준석
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Software Engineer
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Frontend & Full-stack Developer · Based in Seoul
            </p>
          </div>

          {/* Bio Introduction */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 mb-8">
            <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed word-keep-all font-normal">
              문제를 정의하고 코드로 가치를 만들어가는 개발자입니다.<br />
              사용자 중심의 직관적인 경험과 지속 가능한 클린 코드를 지향합니다.
            </p>
          </div>

          {/* Core Values Section */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3.5 flex items-center gap-2">
              <span>🚀 핵심 가치 (Core Values)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {values.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-800/70 hover:border-indigo-400/40 dark:hover:border-indigo-500/40 transition-all duration-200 group"
                >
                  <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed word-keep-all">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3.5 flex items-center gap-2">
              <span>🛠️ 기술 스택 (Tech Stack)</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 hover:scale-105 cursor-default ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Projects & Links */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3.5 flex items-center gap-2">
              <span>📁 주요 프로젝트 및 링크</span>
            </h2>

            <div className="space-y-3">
              {/* mylink Card */}
              <a
                href="https://github.com/junseok1028/mylink"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-800/70 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    🔗
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        mylink
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-medium">
                        Personal Profile
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Next.js & Tailwind CSS 기반의 반응형 개인 프로필 및 링크 큐레이션 웹
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center text-xs font-semibold text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <span>GitHub 보기</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>

              {/* GitHub Repository Card */}
              <a
                href="https://github.com/junseok1028"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-800/70 hover:border-slate-400 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-200 gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    💻
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        GitHub Profile (@junseok1028)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      오픈소스 기여 및 지속적으로 작업 중인 프로젝트 둘러보기
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center text-xs font-semibold text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  <span>방문하기</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Contact / Email Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/60 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>💬 협업 및 커피챗 제안</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300">
                새로운 프로젝트 논의나 질문이 있으시면 언제든지 편하게 연락해주세요!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="mailto:ahnjs4291@gmail.com"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all duration-200 inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일 발송
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 text-center text-xs text-slate-400 dark:text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 안준석 (Junseok Ahn). All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Crafted with</span>
              <span className="text-rose-500">♥</span>
              <span>using Next.js & Tailwind</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import QueryProvider from "@/app/QueryProvider";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://mylink.kr");

export const viewport: Viewport = {
  themeColor: "#3182F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "마이링크 (MyLink) | 나만의 바이오 프로필",
    template: "%s | 마이링크 (MyLink)",
  },
  description:
    "인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 한 곳에 모으는 가장 쉬운 올인원 바이오 프로필 링크 서비스입니다.",
  keywords: [
    "마이링크",
    "MyLink",
    "바이오링크",
    "프로필링크",
    "인스타링크",
    "링크트리",
    "멀티링크",
    "포트폴리오링크",
    "링크모음",
    "디지털명함",
  ],
  authors: [{ name: "MyLink", url: siteUrl }],
  creator: "MyLink",
  publisher: "MyLink",
  applicationName: "마이링크 (MyLink)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "마이링크 (MyLink) | 나만의 바이오 프로필",
    description:
      "인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 한 곳에 모으는 가장 쉬운 올인원 바이오 프로필 링크 서비스입니다.",
    url: siteUrl,
    siteName: "마이링크 (MyLink)",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/api/og?title=MyLink&type=static",
        width: 1200,
        height: 630,
        alt: "마이링크 (MyLink)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 (MyLink) | 나만의 바이오 프로필",
    description:
      "인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 한 곳에 모으는 가장 쉬운 올인원 바이오 프로필 링크 서비스입니다.",
    images: ["/api/og?title=MyLink&type=static"],
  },
  verification: {
    other: {
      "naver-site-verification": "a157f44866b785a05b7ed7b2a5c5dadc",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "마이링크 (MyLink)",
    url: siteUrl,
    description:
      "인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 한 곳에 모으는 올인원 바이오 프로필 링크 서비스",
    inLanguage: "ko-KR",
  };

  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
              style: {
                background: "#191F28",
                color: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 10px 25px -4px rgba(0, 0, 0, 0.3)",
                fontSize: "13px",
                fontWeight: "500",
                padding: "11px 16px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}


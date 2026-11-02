import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "마이링크 (MyLink) | 나만의 바이오 프로필",
  description: "개인 맞춤형 링크 및 프로필 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
              style: {
                background: '#191F28',
                color: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.3)',
                fontSize: '13px',
                fontWeight: '500',
                padding: '11px 16px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

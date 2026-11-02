import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Link2, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center space-y-6">
        {/* 404 Icon */}
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
          <Link2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        {/* 404 Title & Description */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
            404 Not Found
          </span>
          <h1 className="text-2xl font-bold text-[#191F28] tracking-tight">
            페이지를 찾을 수 없어요
          </h1>
          <p className="text-sm text-[#4E5968] leading-relaxed break-keep">
            요청하신 사용자의 프로필이 존재하지 않거나,<br />
            표시 이름(displayName)이 변경되었을 수 있습니다.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="pt-2 w-full">
          <Link href="/" className="w-full inline-block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 text-sm font-semibold shadow-xs">
              <Home className="w-4 h-4 mr-1.5" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-xs text-[#8B95A1]">
        Powered by <span className="text-blue-600 font-semibold">MyLink</span>
      </footer>
    </div>
  );
}

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '마이링크 (MyLink) - 나만의 바이오 프로필',
    short_name: 'MyLink',
    description: '인스타그램, 유튜브, 블로그, 포트폴리오 등 모든 링크를 한곳에 모으는 올인원 바이오 링크 서비스',
    start_url: '/',
    display: 'standalone',
    background_color: '#F9FAFB',
    theme_color: '#3182F6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

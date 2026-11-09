import type { MetadataRoute } from 'next';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://mylink.kr');

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    const displayNamesSnap = await getDocs(
      query(collection(db, 'display_names'), limit(100))
    );
    displayNamesSnap.forEach((doc) => {
      const displayName = doc.id;
      if (displayName) {
        routes.push({
          url: `${siteUrl}/${encodeURIComponent(displayName)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  } catch {
    // Firestore 조회 실패 또는 빌드 타임 오프라인 시 기본 라우트만 안전하게 반환
  }

  return routes;
}

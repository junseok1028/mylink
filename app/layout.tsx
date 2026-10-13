export const metadata = {
  title: '안준석 | Software Engineer',
  description: '소프트웨어 엔지니어 안준석의 프로필 페이지',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}

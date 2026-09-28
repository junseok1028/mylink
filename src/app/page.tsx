export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-zinc-950 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          안준석
        </h1>
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Software Engineer
        </p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
          문제를 정의하고 코드로 가치를 만들어가는 개발자입니다.<br />
          사용자 중심의 직관적인 경험과 지속 가능한 클린 코드를 지향합니다.
        </p>
      </div>
    </div>
  );
}

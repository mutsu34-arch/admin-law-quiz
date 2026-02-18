import Link from "next/link";
import { getQuizzes } from "@/lib/quiz-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "행정법 OX 퀴즈 | 공무원·법원·변호사 시험 기출",
  description:
    "국가직 9급, 지방직, 법원직, 변호사 시험 행정법 기출문제 OX 퀴즈. 기출문제로 행정법 실력 향상.",
  openGraph: {
    title: "행정법 OX 퀴즈 | 공무원·법원·변호사 시험 기출",
    description: "국가직 9급, 지방직, 법원직, 변호사 시험 행정법 기출문제 OX 퀴즈",
  },
};

export default async function QuizListPage() {
  let quizzes: Awaited<ReturnType<typeof getQuizzes>> = [];
  try {
    quizzes = await getQuizzes(50);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← 홈
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
          행정법 OX 퀴즈
        </h1>
        <p className="mt-2 text-slate-600">
          공무원, 법원직, 변호사 시험 행정법 기출문제
        </p>
      </header>

      {quizzes.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-slate-600 shadow-sm">
          아직 등록된 퀴즈가 없습니다.
        </div>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((q) => (
            <li key={q.id}>
              <Link
                href={`/quiz/${q.id}`}
                className="block rounded-lg border bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow md:p-5"
              >
                <p className="line-clamp-2 text-slate-800 md:text-lg">
                  {q.question}
                </p>
                <p className="mt-2 text-sm text-slate-500">{q.examInfo}</p>
                {q.keywords?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {q.keywords.slice(0, 3).map((k) => (
                      <span
                        key={k}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <nav className="mt-8 flex gap-4">
        <Link
          href="/pricing"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          요금제
        </Link>
        <Link
          href="/wrong-notes"
          className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
        >
          오답 노트
        </Link>
      </nav>
    </div>
  );
}

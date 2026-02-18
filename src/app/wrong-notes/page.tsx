"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface QuizItem {
  id: string;
  question: string;
  examInfo: string;
  answer?: string;
  basicExplanation?: string;
  detailedExplanation?: string;
}

export default function WrongNotesPage() {
  const { user, profile } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }
    async function load() {
      if (!user) return;
      const snap = await getDoc(doc(db, "wrongAnswers", user.uid));
      const quizIds = (snap.data()?.quizIds as string[]) || [];
      if (quizIds.length === 0) {
        setQuizzes([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/quizzes/by-ids?ids=${quizIds.join(",")}`);
      const data = await res.json();
      setQuizzes(data.quizzes || []);
      setLoading(false);
    }
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-600">로그인이 필요합니다.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          홈으로
        </Link>
      </div>
    );
  }

  if (profile?.membershipTier !== "paid") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-center text-slate-600">
          오답 노트는 유료 회원 전용 기능입니다.
        </p>
        <Link
          href="/pricing"
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          유료 전환
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/quiz" className="text-blue-600 hover:underline">
        ← 퀴즈 목록
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-800">오답 노트</h1>
      <p className="mt-2 text-slate-600">틀린 문제를 다시 풀어보세요.</p>

      {quizzes.length === 0 ? (
        <div className="mt-8 rounded-lg bg-white p-8 text-center text-slate-600 shadow-sm">
          아직 오답 노트에 저장된 문제가 없습니다.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {quizzes.map((q) => (
            <li key={q.id}>
              <Link
                href={`/quiz/${q.id}`}
                className="block rounded-lg border bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow"
              >
                <p className="line-clamp-2 text-slate-800">{q.question}</p>
                <p className="mt-2 text-sm text-slate-500">{q.examInfo}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

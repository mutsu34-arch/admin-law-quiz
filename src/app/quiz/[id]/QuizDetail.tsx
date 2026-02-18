"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type QuizData = {
  id: string;
  question: string;
  answer: "O" | "X";
  basicExplanation: string;
  detailedExplanation: string;
  keywords: string[];
  caseNumbers: string[];
  examInfo: string;
};

export default function QuizDetail({ quiz }: { quiz: QuizData }) {
  const { user, profile } = useAuth();
  const [selected, setSelected] = useState<"O" | "X" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const isGuest = !user;
  const isFree = user && profile?.membershipTier === "free";
  const isPaid = user && profile?.membershipTier === "paid";

  const canSeeBasicExplanation = !isGuest;
  const canSeeDetailedExplanation = isPaid;

  const handleSubmit = async () => {
    if (selected === null) return;
    setShowAnswer(true);
    if (isPaid && user && db && selected !== quiz.answer) {
      try {
        await saveWrongAnswer(user.uid, quiz.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const showPaywall = (content: string, type: "basic" | "detailed") => (
    <div className="relative">
      <div className="select-none blur-sm">{content}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-slate-900/60 p-4">
        <p className="text-center text-white">
          {type === "basic"
            ? "기본 해설은 로그인 후 이용 가능합니다."
            : "상세 해설은 유료 회원만 이용 가능합니다."}
        </p>
        <Link
          href={isGuest ? "/" : "/pricing"}
          className="mt-3 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          {isGuest ? "구글 로그인" : "유료 전환"}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/quiz" className="text-blue-600 hover:underline">
        ← 퀴즈 목록
      </Link>

      <article className="mx-auto max-w-2xl">
        <p className="mt-4 text-sm text-slate-500">{quiz.examInfo}</p>
        <h1 className="mt-2 text-xl font-bold text-slate-800 break-words sm:text-2xl">
          {quiz.question}
        </h1>

        {quiz.keywords?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quiz.keywords.map((k) => (
              <span
                key={k}
                className="rounded bg-slate-200 px-2 py-1 text-sm text-slate-700"
              >
                {k}
              </span>
            ))}
          </div>
        )}

        {!showAnswer ? (
          <div className="mt-8 space-y-4">
            <p className="font-medium text-slate-700">참(O) 또는 거짓(X)?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelected("O")}
                className={`flex-1 rounded-lg py-4 text-lg font-medium transition ${
                  selected === "O"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 shadow hover:bg-slate-50"
                }`}
              >
                O (참)
              </button>
              <button
                onClick={() => setSelected("X")}
                className={`flex-1 rounded-lg py-4 text-lg font-medium transition ${
                  selected === "X"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 shadow hover:bg-slate-50"
                }`}
              >
                X (거짓)
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="w-full rounded-lg bg-slate-800 py-3 font-medium text-white disabled:opacity-50 hover:bg-slate-900"
            >
              정답 확인
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div
              className={`rounded-lg p-4 ${
                selected === quiz.answer ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-bold">
                정답: {quiz.answer} {selected === quiz.answer ? "✓" : "✗"}
              </p>
            </div>

            <section>
              <h2 className="font-semibold text-slate-800">기본 해설</h2>
              {canSeeBasicExplanation ? (
                <p className="mt-2 whitespace-pre-wrap break-words text-slate-700">
                  {quiz.basicExplanation}
                </p>
              ) : (
                showPaywall(quiz.basicExplanation, "basic")
              )}
            </section>

            <section>
              <h2 className="font-semibold text-slate-800">상세 해설</h2>
              {canSeeDetailedExplanation ? (
                <div className="mt-2 whitespace-pre-wrap break-words text-slate-700">
                  {quiz.detailedExplanation}
                </div>
              ) : (
                showPaywall(quiz.detailedExplanation, "detailed")
              )}
            </section>

            {quiz.caseNumbers?.length > 0 && (
              <section>
                <h2 className="font-semibold text-slate-800">관련 판례</h2>
                <ul className="mt-2 list-disc pl-5 text-slate-700">
                  {quiz.caseNumbers.map((c) => (
                    <li key={c} className="break-words">{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

async function saveWrongAnswer(userId: string, quizId: string) {
  if (!db) return;
  const ref = doc(db, "wrongAnswers", userId);
  const snap = await getDoc(ref);
  const current = (snap.data()?.quizIds as string[]) || [];
  if (!current.includes(quizId)) {
    await setDoc(ref, {
      quizIds: [...current, quizId],
      updatedAt: new Date(),
    });
  }
}

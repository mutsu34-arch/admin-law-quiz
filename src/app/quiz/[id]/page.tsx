import { notFound } from "next/navigation";
import { getQuizById } from "@/lib/quiz-data";
import QuizDetail from "./QuizDetail";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getQuizById(id);
  if (!quiz) return { title: "퀴즈" };
  return {
    title: `${quiz.question.slice(0, 50)}... | 행정법 OX 퀴즈`,
    description: `${quiz.examInfo} 행정법 기출 OX 퀴즈`,
  };
}

export default async function QuizPage({ params }: Props) {
  const { id } = await params;
  const quiz = await getQuizById(id);
  if (!quiz) notFound();

  const quizData = {
    ...quiz,
    createdAt:
      quiz.createdAt && typeof quiz.createdAt === "object" && "toDate" in quiz.createdAt
        ? (quiz.createdAt as { toDate: () => Date }).toDate().toISOString()
        : new Date().toISOString(),
  };

  return <QuizDetail quiz={quizData} />;
}

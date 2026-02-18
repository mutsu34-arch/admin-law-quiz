import { adminDb } from "./firebase-admin";

export interface QuizDoc {
  id: string;
  question: string;
  answer: "O" | "X";
  basicExplanation: string;
  detailedExplanation: string;
  keywords: string[];
  caseNumbers: string[];
  examInfo: string;
  sourceQuestionId: string;
  createdAt: { toDate: () => Date };
}

export async function getQuizzes(limit = 100): Promise<QuizDoc[]> {
  try {
    if (!adminDb) return [];
    const snap = await adminDb
      .collection("quizzes")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt,
    })) as QuizDoc[];
  } catch (e) {
    console.error("[getQuizzes]", e);
    return [];
  }
}

export async function getQuizById(id: string): Promise<QuizDoc | null> {
  if (!adminDb) return null;
  const doc = await adminDb.collection("quizzes").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt } as QuizDoc;
}

export async function getQuizzesByExam(examInfo: string): Promise<QuizDoc[]> {
  if (!adminDb) return [];
  const snap = await adminDb
    .collection("quizzes")
    .where("examInfo", "==", examInfo)
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt,
  })) as QuizDoc[];
}

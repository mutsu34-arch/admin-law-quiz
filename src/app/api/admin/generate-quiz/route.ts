import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateQuizzesFromSource } from "@/lib/gemini";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token || !adminAuth) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }
    const decoded = await adminAuth.verifyIdToken(token);
    if (!ADMIN_EMAIL || decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }
    if (!adminDb) {
      return NextResponse.json({ error: "DB 연결 실패" }, { status: 500 });
    }

    const body = await req.json();
    const { sourceQuestionId } = body as { sourceQuestionId: string };
    if (!sourceQuestionId) {
      return NextResponse.json({ error: "sourceQuestionId 필수" }, { status: 400 });
    }

    const sourceSnap = await adminDb.collection("sourceQuestions").doc(sourceQuestionId).get();
    if (!sourceSnap.exists) {
      return NextResponse.json({ error: "기출문제 없음" }, { status: 404 });
    }
    const source = sourceSnap.data()!;
    const text = source.text as string;
    const examInfo = source.examInfo as string;

    const quizzes = await generateQuizzesFromSource(text, examInfo);
    const quizIds: string[] = [];

    for (const q of quizzes) {
      const ref = await adminDb.collection("quizzes").add({
        ...q,
        examInfo,
        sourceQuestionId,
        createdAt: new Date(),
      });
      quizIds.push(ref.id);
    }

    await adminDb.collection("sourceQuestions").doc(sourceQuestionId).update({
      quizIds,
      updatedAt: new Date(),
    });

    return NextResponse.json({ count: quizzes.length, quizIds });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "퀴즈 생성 실패: " + (e as Error).message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean) || [];
    if (ids.length === 0) {
      return NextResponse.json({ quizzes: [] });
    }
    if (!adminDb) {
      return NextResponse.json({ quizzes: [] });
    }

    const db = adminDb;
    const quizzes = await Promise.all(
      ids.map(async (id) => {
        const doc = await db.collection("quizzes").doc(id).get();
        if (!doc.exists) return null;
        const d = doc.data()!;
        return {
          id: doc.id,
          question: d.question,
          examInfo: d.examInfo,
          answer: d.answer,
          basicExplanation: d.basicExplanation,
          detailedExplanation: d.detailedExplanation,
          keywords: d.keywords || [],
          caseNumbers: d.caseNumbers || [],
        };
      })
    );

    return NextResponse.json({
      quizzes: quizzes.filter(Boolean),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

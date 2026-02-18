import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function GET(req: NextRequest) {
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
      return NextResponse.json({ sources: [] });
    }

    const snap = await adminDb
      .collection("sourceQuestions")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const sources = snap.docs.map((d) => ({
      id: d.id,
      text: d.data().text,
      examInfo: d.data().examInfo,
      quizIds: d.data().quizIds || [],
    }));

    return NextResponse.json({ sources });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

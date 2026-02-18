import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

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
    const { text, examInfo } = body as { text: string; examInfo: string };
    if (!text?.trim() || !examInfo?.trim()) {
      return NextResponse.json({ error: "text와 examInfo 필수" }, { status: 400 });
    }

    const ref = await adminDb.collection("sourceQuestions").add({
      text: text.trim(),
      examInfo: examInfo.trim(),
      createdAt: new Date(),
      quizIds: [],
    });

    return NextResponse.json({ id: ref.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}

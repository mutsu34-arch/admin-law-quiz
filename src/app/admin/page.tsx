"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface SourceQuestion {
  id: string;
  text: string;
  examInfo: string;
  quizIds: string[];
}

export default function AdminPage() {
  const { user, profile } = useAuth();
  const [examInfo, setExamInfo] = useState("");
  const [text, setText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [sources, setSources] = useState<SourceQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isAdmin = !!user?.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ? user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
    : false;

  useEffect(() => {
    if (!isAdmin || !user) return;
    fetchSources();
  }, [isAdmin, user]);

  async function fetchSources() {
    if (!user) return;
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/sources", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSources(data.sources || []);
    }
  }

  async function handleUpload() {
    const content = text.trim() || fileContent.trim();
    if (!content || !examInfo.trim()) {
      setMessage("시험 정보와 기출문제 내용을 입력하세요.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: content, examInfo: examInfo.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      setMessage("업로드 완료");
      setText("");
      setFileContent("");
      fetchSources();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(sourceId: string) {
    setLoading(true);
    setMessage("");
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sourceQuestionId: sourceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "생성 실패");
      setMessage(`${data.count}개 퀴즈 생성 완료`);
      fetchSources();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileContent((reader.result as string) || "");
    reader.readAsText(file, "UTF-8");
  }

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

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-600">관리자만 접근 가능합니다.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/" className="text-blue-600 hover:underline">
        ← 홈
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-800">관리자</h1>
      <p className="mt-2 text-slate-600">기출문제 업로드 및 AI 퀴즈 생성</p>

      <section className="mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">기출문제 업로드</h2>
        <input
          type="text"
          placeholder="시험 정보 (예: 2023년 국가직 9급)"
          value={examInfo}
          onChange={(e) => setExamInfo(e.target.value)}
          className="mt-3 w-full rounded border border-slate-300 px-3 py-2"
        />
        <textarea
          placeholder="기출문제 텍스트 붙여넣기"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="mt-3 w-full rounded border border-slate-300 px-3 py-2"
        />
        <p className="mt-2 text-sm text-slate-500">또는 파일 업로드</p>
        <input
          type="file"
          accept=".txt,.md"
          onChange={handleFileChange}
          className="mt-2"
        />
        {fileContent && (
          <p className="mt-2 text-sm text-green-600">
            파일 로드됨 ({fileContent.length}자)
          </p>
        )}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50 hover:bg-blue-700"
        >
          업로드
        </button>
      </section>

      <section className="mt-8 max-w-2xl">
        <h2 className="font-semibold text-slate-800">업로드된 기출문제</h2>
        {message && (
          <p
            className={`mt-2 text-sm ${
              message.includes("실패") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
        <ul className="mt-4 space-y-4">
          {sources.map((s) => (
            <li
              key={s.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-slate-500">{s.examInfo}</p>
              <p className="mt-1 line-clamp-2 text-slate-800">{s.text}</p>
              <p className="mt-2 text-sm text-slate-500">
                생성된 퀴즈: {s.quizIds?.length || 0}개
              </p>
              <button
                onClick={() => handleGenerate(s.id)}
                disabled={loading}
                className="mt-3 rounded bg-slate-700 px-4 py-1 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
              >
                AI 퀴즈 생성
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

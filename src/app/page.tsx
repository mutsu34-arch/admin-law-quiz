"use client";

import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, profile, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">
        행정법 퀴즈에 오신 것을 환영합니다!
      </h1>

      {loading ? (
        <p className="text-slate-600">로딩 중...</p>
      ) : user ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-600">
            <strong>{user.displayName || user.email}</strong>님, 로그인되었습니다.
          </p>
          <p className="rounded-lg bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            {profile?.membershipTier === "paid" ? "⭐ 유료 회원" : "무료 회원"}
          </p>
          <a
            href="/pricing"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            요금제 보기
          </a>
          <button
            onClick={signOut}
            className="rounded-lg bg-slate-200 px-4 py-2 text-slate-800 hover:bg-slate-300"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-600">구글 계정으로 로그인하세요.</p>
          <a
            href="/pricing"
            className="text-sm text-blue-600 hover:underline"
          >
            요금제 보기
          </a>
          <button
            onClick={signInWithGoogle}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            구글 로그인
          </button>
        </div>
      )}
    </div>
  );
}

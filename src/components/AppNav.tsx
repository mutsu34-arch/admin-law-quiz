"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function AppNav() {
  const { user, profile, signInWithGoogle, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-slate-800 hover:text-slate-600">
          행정법 OX 퀴즈
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            href="/quiz"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            퀴즈 풀기
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            요금제
          </Link>
          <Link
            href="/wrong-notes"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            오답 노트
          </Link>
          {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <Link
              href="/admin"
              className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50"
            >
              관리자
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                {user.displayName || user.email}
                {profile?.membershipTier === "paid" ? " · ⭐" : ""}
              </span>
              <button
                onClick={signOut}
                className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-300"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
            >
              구글 로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreemCheckout } from "@creem_io/nextjs";
import { useAuth } from "@/lib/auth-context";

const MONTHLY_PRODUCT_ID = "prod_11zv1ykGBOY0V9x4G3mp5X";

function PricingContent() {
  const { user, profile, refreshProfile } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      refreshProfile();
    }
  }, [searchParams, refreshProfile]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Link href="/" className="mb-6 inline-block text-blue-600 hover:underline">
        ← 홈으로
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-slate-800">요금제</h1>

      {profile?.membershipTier === "paid" && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-center text-green-800">
          ⭐ 유료 회원입니다. 모든 기능을 이용할 수 있어요.
        </div>
      )}

      <div className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">월간 구독</h2>
        <p className="mb-4 text-2xl font-bold text-slate-900">$7 <span className="text-base font-normal text-slate-600">/월</span></p>
        <p className="mb-6 text-slate-600">기본 해설, 상세 해설, 오답 노트 이용 가능</p>

        <CreemCheckout
          productId={MONTHLY_PRODUCT_ID}
          referenceId={user?.uid}
          customer={user?.email ? { email: user.email } : undefined}
          successUrl="/pricing?success=1"
        >
          <button className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
            구독하기 ($7/월)
          </button>
        </CreemCheckout>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        테스트 모드입니다. 실제 결제는 되지 않습니다.
      </p>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">로딩 중...</div>}>
      <PricingContent />
    </Suspense>
  );
}

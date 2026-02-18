import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { AppNav } from "@/components/AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "행정법 OX 퀴즈 | 공무원·법원·변호사 시험 기출",
  description:
    "국가직 9급, 지방직, 법원직, 변호사 시험 행정법 기출문제 OX 퀴즈. 기출문제로 행정법 실력 향상.",
  openGraph: {
    title: "행정법 OX 퀴즈 | 공무원·법원·변호사 시험 기출",
    description: "국가직 9급, 지방직, 법원직, 변호사 시험 행정법 기출문제 OX 퀴즈",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          <AppNav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

export type MembershipTier = "free" | "paid";

interface UserProfile {
  membershipTier: MembershipTier;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // 무한 로딩 방지: 처음부터 false로 시작 (로그인 화면 바로 표시)
  const [loading, setLoading] = useState(false);

  const refreshProfile = async () => {
    if (!user || !db) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setProfile({ membershipTier: snap.data().membershipTier || "free" });
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    // 무한 로딩 방지: 3초 후 강제로 로딩 해제
    const timeout = setTimeout(() => setLoading(false), 3000);
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && db) {
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setProfile({ membershipTier: snap.data().membershipTier || "free" });
        } else {
          await setDoc(userRef, {
            email: u.email,
            displayName: u.displayName,
            membershipTier: "free",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          setProfile({ membershipTier: "free" });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      alert("Firebase가 설정되지 않았습니다. .env.local의 Firebase 값을 확인해주세요.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      alert("로그인 실패: " + (e as Error).message);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from './firebase';

export function getEmailPrefix(user: User | null): string {
  if (!user) return '';
  if (user.email) {
    return user.email.split('@')[0];
  }
  return user.displayName || '사용자';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  displayName: string;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  displayName: '',
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // onAuthStateChanged로 인증 상태 실시간 감지
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // 최초 또는 변경 시 users/{uid} 문서에 displayName 동기화
        const prefix = getEmailPrefix(currentUser);
        try {
          const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
          const { db } = await import('./firebase');
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (!snap.exists() || !snap.data()?.displayName) {
            await setDoc(
              userDocRef,
              {
                displayName: prefix,
                display_name: prefix,
                email: currentUser.email || null,
                photoURL: currentUser.photoURL || null,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (e) {
          // 비동기 백그라운드 동기화 실패 시 무시
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // 팝업 닫힘 에러 등은 제외하고 콘솔 출력
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error('Google 로그인 오류:', error);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  };

  const displayName = getEmailPrefix(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        displayName,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

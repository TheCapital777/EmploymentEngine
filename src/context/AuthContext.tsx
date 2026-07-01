"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, signInWithCredential, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../lib/firebase/config";

export interface UserData {
  premiumUntil?: number;
  referredBy?: string;
  referralCount?: number;
}

export const REFERRAL_GOAL = 3;
const PREMIUM_BONUS_MS = 30 * 24 * 60 * 60 * 1000;

const creditReferral = async (referrerUid: string) => {
  try {
    const refDocRef = doc(db, "users", referrerUid);
    const refSnap = await getDoc(refDocRef);
    if (!refSnap.exists()) return;
    const referrerData = refSnap.data() as UserData;
    const newCount = (referrerData.referralCount || 0) + 1;
    const updates: Partial<UserData> = { referralCount: newCount };
    if (newCount % REFERRAL_GOAL === 0) {
      const base = referrerData.premiumUntil && referrerData.premiumUntil > Date.now() ? referrerData.premiumUntil : Date.now();
      updates.premiumUntil = base + PREMIUM_BONUS_MS;
    }
    await setDoc(refDocRef, updates, { merge: true });
  } catch (error) {
    console.error("Failed to credit referral", error);
  }
};

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGoogleOneTap: (credential: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithGoogleOneTap: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  logout: async () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        await setDoc(docRef, { createdAt: Date.now() }, { merge: true });
        setUserData({});
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          const refParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ref") : null;
          const isValidReferral = refParam && refParam !== currentUser.uid;
          await setDoc(docRef, { createdAt: Date.now(), ...(isValidReferral ? { referredBy: refParam } : {}) }, { merge: true });
          setUserData(isValidReferral ? { referredBy: refParam! } : {});
          if (isValidReferral) await creditReferral(refParam!);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signInWithGoogleOneTap = async (credential: string) => {
    try {
      const googleCredential = GoogleAuthProvider.credential(credential);
      await signInWithCredential(auth, googleCredential);
    } catch (error) {
      console.error("Error signing in with One Tap", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signInWithGoogleOneTap, signUpWithEmail, signInWithEmail, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, isPreviewMode } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPreview: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for preview mode (when Firebase config exists but SDK can't init in v0 sandbox)
const PREVIEW_USER = {
  uid: "preview-user",
  email: "admin@preview.local",
  displayName: "Preview Admin",
  emailVerified: true,
} as unknown as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preview mode: Firebase config exists but SDK failed to init (v0 sandbox)
    if (isPreviewMode) {
      // Don't auto-login; wait for signIn to set preview user
      setLoading(false);
      return;
    }

    // If Firebase is not configured at all, skip auth state listener
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Preview mode: accept any credentials and set mock user
    if (isPreviewMode) {
      setUser({ ...PREVIEW_USER, email } as unknown as User);
      return;
    }

    if (!auth) {
      const err = new Error("Firebase is not configured. Please add Firebase environment variables.");
      (err as unknown as Record<string, string>).code = "auth/not-configured";
      throw err;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (isPreviewMode) {
      setUser(null);
      return;
    }
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isPreview: isPreviewMode, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

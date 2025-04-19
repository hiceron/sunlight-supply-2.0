import { create } from 'zustand';
import { auth, database, ADMIN_UID } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { ref, get } from 'firebase/database';

interface AuthStore {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,

  initialize: () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const isAdmin = user.uid === ADMIN_UID;
          set({ user, isAdmin, loading: false, error: null });
        } else {
          set({ user: null, isAdmin: false, loading: false, error: null });
        }
        resolve();
      });
      return () => unsubscribe();
    });
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = user.uid === ADMIN_UID;
      set({ user, isAdmin, loading: false, error: null });
    } catch (error: any) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
      }
      
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, isAdmin: false, error: null });
    } catch (error: any) {
      set({ error: error.message || 'Sign out failed' });
      throw error;
    }
  },
}));
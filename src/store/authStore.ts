import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'parent' | 'student' | 'teacher' | 'preschool' | null;

interface User {
  id: string;
  name: string;
  nameNe?: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

interface AuthState {
  role: UserRole;
  userId: string | null;
  user: User | null;
  setRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      userId: null,
      user: null,
      setRole: (role) => set({ role }),
      setUser: (user) => set({ user, userId: user?.id, role: user?.role }),
      logout: () => set({ role: null, userId: null, user: null }),
    }),
    { name: 'edunexus-auth' }
  )
);

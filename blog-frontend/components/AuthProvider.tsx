'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getProfile } from '@/app/actions/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getProfile();
      if (user) {
        setUser(user);
      }
    };
    checkAuth();
  }, [setUser]);

  return <>{children}</>;
}
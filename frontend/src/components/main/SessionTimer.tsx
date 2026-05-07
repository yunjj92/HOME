import { useState, useEffect } from 'react';
import { useAuthStore } from '../auth/stores/authStore';

export const SessionTimer = () => {
  const { sessionExpiry, isLoggedIn, logout } = useAuthStore();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !sessionExpiry) {
      setRemainingTime(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, sessionExpiry - now);
      setRemainingTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiry, isLoggedIn, logout]);

  if (!isLoggedIn || remainingTime === null) return null;

  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  return (
    <div className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
      Session: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

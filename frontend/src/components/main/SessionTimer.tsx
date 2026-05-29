import { useSyncExternalStore, useCallback } from 'react';
import { useAuthStore } from '../../hooks/authentication/authStore';

const TEN_MINUTES_MS = 10 * 60 * 1000;

const subscribe = (onStoreChange: () => void) => {
  const interval = setInterval(onStoreChange, 10000); // Check every 10 seconds
  return () => clearInterval(interval);
};

const getSessionStatus = (expiry: number | null, isLoggedIn: boolean) => {
  if (!isLoggedIn || !expiry) return null;
  
  const now = Date.now();
  const remaining = expiry - now;

  if (remaining <= 0) return '로그인 만료됨';
  if (remaining <= TEN_MINUTES_MS) return '로그인 연장 필요';
  return '로그인 중';
};

export const SessionTimer = () => {
  const { sessionExpiry, isLoggedIn } = useAuthStore();
  
  const getSnapshot = useCallback(
    () => getSessionStatus(sessionExpiry, isLoggedIn),
    [sessionExpiry, isLoggedIn]
  );

  const status = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => null
  );

  if (!status) return null;

  const isWarning = status === '로그인 연장 필요';
  const isExpired = status === '로그인 만료됨';

  return (
    <div className={`text-sm font-medium px-2 py-1 rounded ${
      isWarning || isExpired 
        ? 'text-red-600 bg-red-50 border border-red-100' 
        : 'text-gray-600 bg-gray-100 border border-gray-200'
    }`}>
      {status}
    </div>
  );
};

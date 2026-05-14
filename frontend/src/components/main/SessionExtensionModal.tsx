import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuthStore } from '../auth/stores/authStore';
import axios from 'axios';
import { getJwtExpiration } from '../../util/jwt';

export const SessionExtensionModal = () => {
  const { isLoggedIn, sessionExpiry, login, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(60);

  // Notification threshold: 5 minutes (300,000 ms)
  const THRESHOLD = 300000;

  useEffect(() => {
    if (!isLoggedIn || !sessionExpiry) {
      setIsOpen(false);
      return;
    }

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const remaining = sessionExpiry - now;

      if (remaining <= THRESHOLD && remaining > 0 && !isOpen) {
        setIsOpen(true);
        setModalCountdown(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [isLoggedIn, sessionExpiry, isOpen]);

  useEffect(() => { 
    let timer: ReturnType<typeof setTimeout>;
    if (isOpen && modalCountdown > 0) {
      timer = setTimeout(() => setModalCountdown(modalCountdown - 1), 1000);
    } else if (isOpen && modalCountdown <= 0) {
      handleLogout();
    }
    return () => clearTimeout(timer);
  }, [isOpen, modalCountdown]);

  const handleExtend = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const userName = localStorage.getItem('userName');
    
    if (storedRefreshToken && userName) {
      try {
        // Call the real refresh API using axios for consistency
        const response = await axios.get('http://localhost:8080/api/auth/refresh', {
          params: { refreshToken: storedRefreshToken }
        });
        
        const result = response.data;
        
        if (result.success && result.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data;
          
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          const newExpiry = getJwtExpiration(newAccessToken);
          login(userName, newExpiry, newRefreshToken || storedRefreshToken);
          setIsOpen(false);
          alert('Session extended successfully');
        } else {
          throw new Error('Refresh failed');
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    setIsOpen(false);
    window.location.href = '/login';
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <span className="text-xl">⏳</span>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Session Expiring Soon
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your session will expire in <span className="font-bold text-red-600">{modalCountdown}</span> seconds. 
                        Would you like to extend your session?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={void handleExtend}
                  >
                    Extend Session
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

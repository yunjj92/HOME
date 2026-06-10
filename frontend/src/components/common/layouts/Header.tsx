import { Bars3Icon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../../hooks/authentication/authStore';
import { SessionTimer } from '../../main/SessionTimer';
import { DesktopMenu, MobileMenu } from './Menu';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { isLoggedIn, userName, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        void navigate({ to: '/' });
    };

return (
    <>
<header className="relative z-10 bg-white border-b flex-none">
      <nav className="mx-auto flex max-w-7xl items-center justify-between h-20 px-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <DesktopMenu />
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
          {isLoggedIn ? (
            <>
              <SessionTimer />
              <span className="text-sm font-semibold text-gray-900">Hello, {userName}</span>
              <button
                onClick={handleLogout}
                className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
              >
                Log out <span aria-hidden="true">&rarr;</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm/6 font-semibold text-gray-900">
                Log in
              </Link>
              <Link
                to="/"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              </Link>
            </>
          )}
        </div>
      </nav>
      <MobileMenu 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        isLoggedIn={isLoggedIn} 
        userName={userName} 
        handleLogout={handleLogout} 
      />
    </header>
    </>
  );
};

export default Header;
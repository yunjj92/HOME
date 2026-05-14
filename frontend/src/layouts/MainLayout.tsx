import { Outlet } from "@tanstack/react-router";
import Header from "../components/main/Header";
import { useEffect } from "react";
import { useAuthStore } from "../components/auth/stores/authStore";
import { getJwtExpiration } from "../util/jwt";
import { SessionExtensionModal } from "../components/main/SessionExtensionModal";

export function MainLayout() {
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userName = localStorage.getItem('userName');
        if (token && userName) {
            const expiry = getJwtExpiration(token);
            login(userName, expiry, refreshToken);
        }
    }, [login]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <SessionExtensionModal />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="bg-white border-t py-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between h-full px-6 lg:px-8">
                    <p className="text-sm/6 text-gray-500">© 2026 Your Company. All rights reserved.</p>
                    <div className="flex gap-x-6">
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">Privacy Policy</a>
                        <a href="#" className="text-sm/6 font-semibold text-gray-900">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
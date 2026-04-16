import { Outlet } from "@tanstack/react-router";
import Header from "../components/main/Header";

export function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="h-16 border-t bg-white flex-none">
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
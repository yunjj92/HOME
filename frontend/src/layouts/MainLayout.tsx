import { Outlet } from "@tanstack/react-router";
import Header from "../components/main/Header";

export function MainLayout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <footer>Footer</footer>
        </div>
    );
}
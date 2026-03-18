import { Outlet } from "react-router-dom";
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
'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-sidebar">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main
                    className="flex-1 p-4 overflow-y-auto mt-20 min-h-[calc(100vh-80px)] lg:rounded-tl-xl bg-card overflow-hidden lg:ml-64"
                    onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
                    {children}
                </main>
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
        </div>
    );
};

export default MainLayout;

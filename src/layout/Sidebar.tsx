'use client';

// import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import {
    LayoutGrid, Settings, LogOut, ChevronDown,
    UserRoundPen,
    BadgeInfo,
    ReceiptText,
    GlobeLock,
    Home,
    Mail,
    PanelBottom,
    BookOpen,
    Globe,
    ListOrdered,
    Users,
    UserCog,
    Tags,
    Contact,
    Undo2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch } from "react-redux";
import { setAccessToken, setAdmin } from "@/redux/feature/auth/authSlice";
import { Button } from "../components/ui/button";

type SidebarProps = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

type SidebarNavItem = {
    name: string;
    icon: LucideIcon;
    href: string;
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname() ?? '/';
    const [isManagementOpen, setIsManagementOpen] = useState(true);
    const [isWebsiteOpen, setIsWebsiteOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const isSettingsPath = pathname.startsWith('/settings');
    const isManagementPath = pathname.startsWith('/management');
    const isWebsitePath = pathname.startsWith('/website');
    const prevPathname = useRef(pathname);

    useEffect(() => {
        if (prevPathname.current !== pathname && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
        prevPathname.current = pathname;
    }, [pathname, isSidebarOpen, setIsSidebarOpen]);

    const handleLogout = () => {
        router.push("/auth/login");
        dispatch(setAdmin(null));
        dispatch(setAccessToken(null));
        localStorage.removeItem("accessToken");
    };

    const navItems = useMemo<SidebarNavItem[]>(() => [
        { name: 'Dashboard', icon: LayoutGrid, href: '/' },
    ], []);

    const websiteItems = useMemo<SidebarNavItem[]>(() => [
        { name: 'Homepage', icon: Home, href: '/website/homepage' },
        { name: 'Contact', icon: Mail, href: '/website/contact' },
        { name: 'Footer', icon: PanelBottom, href: '/website/footer' },
    ], []);

    const managementItems = useMemo<SidebarNavItem[]>(() => [
        { name: 'User', icon: Users, href: '/management/users' },
        { name: 'Order', icon: ListOrdered, href: '/management/orders' },
        { name: 'Books', icon: BookOpen, href: '/management/books' },
        { name: 'Category', icon: Tags, href: '/management/categories' },
        { name: 'Contact', icon: Contact, href: '/management/contacts' },
        { name: 'Admin', icon: UserCog, href: '/management/admins' },
    ], []);

    const settingsSubItems = useMemo<SidebarNavItem[]>(() => [
        { name: 'Profile', icon: UserRoundPen, href: '/settings/profile' },
        { name: 'About Us', icon: BadgeInfo, href: '/settings/about' },
        { name: 'Terms & Condition', icon: ReceiptText, href: '/settings/terms' },
        { name: 'Privacy Policy', icon: GlobeLock, href: '/settings/privacy' },
        { name: 'Return Policy', icon: Undo2, href: '/settings/return-policy' },
    ], []);

    return (
        <div className={`fixed top-0 left-0 z-40 h-screen bg-sidebar text-sidebar-foreground w-64 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
            <div className="p-4 flex flex-col items-center text-center">
                {/* <Image
                    src="/images/logo.png"
                    alt="POPY Library logo"
                    width={160}
                    height={48}
                    className="h-12 w-auto dark:brightness-[400]"
                    priority
                /> */}
                <h1 className="text-2xl font-bold tracking-wider mt-4">POPY LIBRARY</h1>
            </div>
            <ScrollArea className="h-[calc(100vh-149px)]">
                <nav className="grow space-y-3 p-4">

                    {/* Dashboard */}
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center justify-start p-2 rounded-sm text-sm font-medium transition-colors duration-200
                    ${isActive ? "border-x-2 border-primary bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}
                            `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <item.icon className="mr-2 w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Management group */}
                    <Collapsible defaultOpen={isManagementOpen}>
                        <CollapsibleTrigger onClick={() => setIsManagementOpen(!isManagementOpen)} className={`w-full flex items-center justify-between p-2 rounded-sm text-base font-medium cursor-pointer transition-colors duration-200 
                    ${isManagementPath ? "border-x-2 border-primary bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}
                            `}>
                            <div className="flex items-center text-sm px-2">
                                <ListOrdered className="mr-2 h-4 w-4" />
                                Management
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isManagementOpen ? "-rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="py-2 space-y-2">
                            {managementItems.map((item, index) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                                        className={`animate-fade-in-up w-[90%] ml-5 flex items-center justify-start px-2 py-2 rounded-sm text-sm font-medium transition-colors duration-200  
                                ${isActive ? "border-x-2 border-primary bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <item.icon className="mr-2 w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Website group */}
                    <Collapsible defaultOpen={isWebsiteOpen}>
                        <CollapsibleTrigger onClick={() => setIsWebsiteOpen(!isWebsiteOpen)} className={`w-full flex items-center justify-between p-2 rounded-sm text-base font-medium cursor-pointer transition-colors duration-200 
                    ${isWebsitePath ? "border-x-2 border-primary bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}
                            `}>
                            <div className="flex items-center text-sm px-2">
                                <Globe className="mr-2 h-4 w-4" />
                                Website
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isWebsiteOpen ? "-rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="py-2 space-y-2">
                            {websiteItems.map((item, index) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                                        className={`animate-fade-in-up w-[90%] ml-5 flex items-center justify-start px-2 py-2 rounded-sm text-sm font-medium transition-colors duration-200  
                                ${isActive ? "border-x-2 border-primary bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <item.icon className="mr-2 w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Settings group */}
                    <Collapsible defaultOpen={isSettingsPath}>
                        <CollapsibleTrigger onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`w-full flex items-center justify-between p-2 rounded-sm text-base font-medium cursor-pointer transition-colors duration-200 
                    ${isSettingsPath ? "border-x-2 border-primary bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}
                            `}>
                            <div className="flex items-center text-sm px-2">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isSettingsOpen ? "-rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="py-2 space-y-2">
                            {settingsSubItems.map((item, index) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                                        className={`animate-fade-in-up w-[90%] ml-5 flex items-center justify-start px-2 py-2 rounded-sm text-sm font-medium transition-colors duration-200  
                                ${isActive ? "border-x-2 border-primary bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <item.icon className="mr-2 w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>
                </nav>
            </ScrollArea>
            <div className="border-t p-4">
                <Button onClick={handleLogout} variant="outline" className="justify-start w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;

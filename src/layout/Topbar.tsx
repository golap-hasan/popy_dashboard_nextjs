"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { useGetAdminProfileQuery } from "@/redux/feature/auth/authApi";
import type { RootState } from "@/redux/store";
import { getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import("@/theme/ThemeToggle"), { ssr: false });
const ThemeToggleMenuItem = dynamic(() => import("@/theme/ThemeToggleMenuItem"), { ssr: false });

type TopbarProps = {
  onMenuClick: () => void;
};

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const router = useRouter();

  const { isLoading } = useGetAdminProfileQuery(undefined);
  const admin = useSelector((state: RootState) => state.auth.admin);

  const handleLogout = () => {
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 right-0 left-0 flex items-center justify-between p-4 h-20 bg-sidebar text-sidebar-foreground lg:justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu />
      </Button>
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* User Profile */}
        <div className="flex items-center">
          {/* Desktop profile (link) */}
          <Link
            href="/settings/profile"
            className="lg:flex items-center gap-3 hidden"
          >
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20 rounded-sm" />
                </div>
              </>
            ) : (
              <>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={admin?.image ?? ""}
                    alt={admin?.name || "User"}
                  />
                  <AvatarFallback>{getInitials(admin?.name as string)}</AvatarFallback>
                </Avatar>
                <span
                  className="text-xs font-medium truncate max-w-[180px]"
                  title={admin?.name || "User"}
                >
                  {admin?.name || "User"}
                </span>
              </>
            )}
          </Link>

          {/* User Dropdown (mobile) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isLoading ? (
                <Skeleton className="h-10 w-10 rounded-full lg:hidden" />
              ) : (
                <Avatar className="h-10 w-10 lg:hidden">
                  <AvatarImage
                    src={admin?.image ?? ""}
                    alt={admin?.name || "User"}
                  />
                  <AvatarFallback>{getInitials(admin?.name as string)}</AvatarFallback>
                </Avatar>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64 mr-4">
              {isLoading ? (
                <div className="p-2 min-w-[200px]">
                  <Skeleton className="h-4 w-28 rounded mb-2" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
              ) : (
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                  <span className="text-foreground truncate text-sm font-medium">
                    {admin?.name || "User"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {admin?.email || ""}
                  </span>
                </DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href="/notifications"
                    className="w-full flex items-center"
                  >
                    <Bell
                      size={16}
                      className="opacity-60 mr-2"
                      aria-hidden="true"
                    />
                    <span>Notifications</span>
                  </Link>
                </DropdownMenuItem>
                <ThemeToggleMenuItem />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon
                  size={16}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

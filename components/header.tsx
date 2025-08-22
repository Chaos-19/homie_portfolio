"use client";

import { Bell, Search, Menu, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logo from "@/public/logo.png";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  // const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // logout();
    router.push("/login");
  };

  const handleNotifications = () => {
    router.push("/notifications");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <header className="sticky top-0 z-50 shadow-md flex h-16 items-center justify-between border-b border-border px-4 sm:px-6 bg-gradient-to-br from-slate-800/20 via-gray-950 to-slate-700/20">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-lg sm:text-2xl font-semibold text-foreground truncate">
          <Image src={logo} alt={title} width={80} height={80} />
        </h1>
      </div>

      <div className="justify-self-end flex items-center gap-10">
        {["dashboard", "portfolio"].map((item) => (
          <Link
            key={item}
            href={item}
            className="text-sm font-medium capitalize text-gray-300 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </header>
  );
}

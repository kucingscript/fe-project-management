import {
  ChevronsUpDown,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { SidebarTrigger } from "./ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { cn, getInitials } from "@/lib/utils";
import { getListCorporates } from "@/services/corporateService";
import { toast } from "sonner";

const Navbar = () => {
  const {
    user,
    logout,
    userCorporate,
    selectedCorporate,
    setSelectedCorporate,
    setUserCorporate,
  } = useAuthStore();

  const navigate = useNavigate({ from: "/admin" });
  const { setTheme } = useTheme();

  const [isLoadingCorporates, setIsLoadingCorporates] = useState(false);

  useEffect(() => {
    const fetchCorporates = async () => {
      setIsLoadingCorporates(true);
      try {
        const response = await getListCorporates({
          limit: 1000,
          status: "ACTIVE",
        });

        const formattedCorporates = response.data;
        setUserCorporate(formattedCorporates);

        if (!selectedCorporate && formattedCorporates.length > 0) {
          setSelectedCorporate(formattedCorporates[0].corporate_id);
        }
      } catch (error) {
        console.error("Failed to fetch corporates", error);
        toast.error("Failed to fetch corporates.");
      } finally {
        setIsLoadingCorporates(false);
      }
    };

    fetchCorporates();
  }, [
    setUserCorporate,
    userCorporate.length,
    selectedCorporate,
    setSelectedCorporate,
  ]);

  const selectedCorporateName = useMemo(() => {
    if (!selectedCorporate) {
      if (isLoadingCorporates) return "Loading...";
      return "Select Corporate";
    }

    const corporate = userCorporate.find(
      (c) => c.corporate_id === selectedCorporate,
    );

    if (corporate) {
      return `${corporate.corporate_code} - ${corporate.corporate_name}`;
    }

    return "Select Corporate";
  }, [selectedCorporate, userCorporate, isLoadingCorporates]);

  const handleCorporateChange = async (corporateId: string) => {
    setSelectedCorporate(corporateId);
    navigate({ to: "/admin" });
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", search: { redirect: undefined } });
  };

  return (
    <nav className="p-4 flex items-center justify-between">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-45 justify-between",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1",
              )}
            >
              <span className="truncate max-w-50">{selectedCorporateName}</span>
              <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width] max-h-75 overflow-y-auto"
          >
            {isLoadingCorporates ? (
              <DropdownMenuItem disabled>
                Loading corporates...
              </DropdownMenuItem>
            ) : userCorporate.length > 0 ? (
              userCorporate.map((corporate) => (
                <DropdownMenuItem
                  key={corporate.corporate_id}
                  onClick={() => handleCorporateChange(corporate.corporate_id)}
                  disabled={corporate.corporate_id === selectedCorporate}
                >
                  {corporate.corporate_code} - {corporate.corporate_name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No corporates found</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=7033ff&color=fff`}
                alt={user?.name || "User Avatar"}
              />
              <AvatarFallback>{getInitials(user?.name)} </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default memo(Navbar);

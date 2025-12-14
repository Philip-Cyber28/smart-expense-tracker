import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await API.post("/auth/logout");
    navigate("/login");
  };
  return (
    <header className="p-2 m-5 rounded-4xl bg-blue-400 text-white shadow mt-5 flex items-center justify-between">
      <h1 className="pl-4 text-2xl font-bold">Smart Expense Tracker</h1>
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="cursor-pointer">
              Manage Expenses
            </NavigationMenuTrigger>
            <NavigationMenuContent className="mr-3 text-black grid gap-4 text-center">
              <NavigationMenuLink href="/viewExpenses">
                View Expenses
              </NavigationMenuLink>
              <NavigationMenuLink href="/addExpenses">
                Add Expenses
              </NavigationMenuLink>
              <NavigationMenuLink href="/uploadExpenses">
                Upload Expenses
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="cursor-pointer">
              Account
            </NavigationMenuTrigger>
            <NavigationMenuContent className="mr-3 text-black grid gap-2 text-center">
              <NavigationMenuLink href="/manageAccount">
                Manage Account
              </NavigationMenuLink>
              <NavigationMenuLink
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Logout
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <div className="flex items-center justify-between px-4 py-2 cursor-default">
            <span className="text-sm pr-3 font-medium">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default NavBar;

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await API.post("/auth/logout");
    navigate("/login");
  };

  return (
    <header className="p-3 md:p-4 bg-black text-white shadow">
      <div className="flex items-center justify-between">
        {/* TITLE */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold px-2">
          Smart Expense Tracker
        </h1>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:block">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink href="/">Home</NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="cursor-pointer">
                  Manage Expenses
                </NavigationMenuTrigger>
                <NavigationMenuContent className="text-white grid gap-4 text-center bg-black">
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
                <NavigationMenuContent className="text-white grid gap-4 text-center bg-black">
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
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3">
          <a
            href="/"
            className="block py-2 px-4 hover:bg-gray-800 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>

          <div className="space-y-2">
            <div className="px-4 py-2 font-semibold text-gray-400">
              Manage Expenses
            </div>
            <a
              href="/viewExpenses"
              className="block py-2 px-6 hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              View Expenses
            </a>
            <a
              href="/addExpenses"
              className="block py-2 px-6 hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Add Expenses
            </a>
            <a
              href="/uploadExpenses"
              className="block py-2 px-6 hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload Expenses
            </a>
          </div>

          <div className="space-y-2">
            <div className="px-4 py-2 font-semibold text-gray-400">Account</div>
            <a
              href="/manageAccount"
              className="block py-2 px-6 hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Manage Account
            </a>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-6 hover:bg-gray-800 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;

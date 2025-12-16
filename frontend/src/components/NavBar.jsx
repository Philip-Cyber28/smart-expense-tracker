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
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await API.post("/auth/logout");
    navigate("/login");
  };
  return (
    <header className="p-2 bg-black text-white shadow flex items-center justify-between">
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
            <NavigationMenuContent className=" text-white grid gap-4 text-center bg-black">
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
            <NavigationMenuContent className=" text-white grid gap-4 text-center bg-black">
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
    </header>
  );
};

export default NavBar;

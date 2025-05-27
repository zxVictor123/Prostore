import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";

import { UserIcon, LogOut } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();

  //  when not signned in ,'sign in' is displayed
  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  //  when signned in ,'User' is displayed
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button className="rounded-full">{firstInitial}</Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 align='end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <p className="text-sm text-muted-foreground leading-none">{session.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <CheckboxItem className="p-0">
            <form action={signOutUser} className="w-full">
                <Button className="w-full py-4 px-2 flex"><LogOut/> Sign Out</Button>
            </form>
          </CheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;

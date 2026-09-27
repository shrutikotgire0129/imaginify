"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>

      <nav className="flex gap-2">
        <Show when="signed-in">
          <>
            <UserButton />

            <Sheet>
              <SheetTrigger>
                <Image
                  src="/assets/icons/menu.svg"
                  alt="menu"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </SheetTrigger>

              <SheetContent className="sheet-content h-screen overflow-y-auto sm:w-50">
                <div className="flex flex-col items-center">
                  <Image
                    src="/assets/images/logo-text.svg"
                    alt="logo"
                    width={152}
                    height={23}
                  />

                  <ul className="header-nav_elements">
                    {navLinks.map((link) => {
                      const isActive = link.route === pathname;

                      return (
                        <li
                          key={link.route}
                          className={`mobile-nav_element ${
                            isActive
                              ? "bg-purple-gradient text-white"
                              : "text-gray-700"
                          }`}
                        >
                          <Link className="mobile-nav_link" href={link.route}>
                            <Image
                              src={link.icon}
                              alt={link.label}
                              width={24}
                              height={24}
                              className={isActive ? "brightness-200" : ""}
                            />
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
          </>
        </Show>

        <Show when="signed-out">
          <SignInButton>
            <Button className="button bg-purple-gradient bg-cover">
              Login
            </Button>
          </SignInButton>
        </Show>
      </nav>
    </header>
  );
};

export default MobileNav;
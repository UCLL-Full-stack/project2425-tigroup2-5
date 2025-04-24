"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";


const Header: React.FC = () => {
  const { t } = useTranslation();
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    useEffect(() => {
      const user = localStorage.getItem("user");
      if (user) {
        setLoggedInUser(user);
      }
    }, []);
    const handleClick = () => {
      localStorage.removeItem("user");
      setLoggedInUser(null);
    }

  return (
    <header className="bg-gradient-to-br from-primary to-primary-dark shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/" className="text-white text-2xl md:text-3xl font-bold">
            AnyGym
          </Link>
          
          <nav className="w-full md:w-auto mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-1">
            <Link href="/" className="nav-link text-white hover:bg-white/10">
              Home
            </Link>
            {loggedInUser && (
              <Link href="/pages/profile" className="nav-link text-white hover:bg-white/10">
                Profile
              </Link>
            )}
            <Link href="/pages/members" className="nav-link text-white hover:bg-white/10">
              Members
            </Link>
            <Link href="/pages/employments" className="nav-link text-white hover:bg-white/10">
              Employments
            </Link>
            <Link href="/pages/employees" className="nav-link text-white hover:bg-white/10">
              Employees
            </Link>
            <Link href="/pages/enrollments" className="nav-link text-white hover:bg-white/10">
              Enrollments
            </Link>
            <Link href="/pages/clubs" className="nav-link text-white hover:bg-white/10">
              Clubs
            </Link>
            <Link href="/pages/signup" className="nav-link text-white hover:bg-white/10">
              Signup
            </Link>
            {!loggedInUser && (
              <Link href="/pages/login" className="nav-link text-white bg-accent/80 hover:bg-accent">
                Login
              </Link>         
            )}
            {loggedInUser && (
              <a
                href="/pages/login"
                onClick={handleClick}
                className="nav-link text-white bg-accent/80 hover:bg-accent"
              >
                Logout
              </a>
            )}
          </nav>
        </div>
        
        {loggedInUser && (
          <div className="text-white text-sm mt-2 pb-1 text-center md:text-right">
            {t("header.welcome")}, <span className="font-medium">{loggedInUser}</span>!
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
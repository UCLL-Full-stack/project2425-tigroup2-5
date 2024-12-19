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
    <header className="p-3 mb-3 border-bottom bg-gradient-to-br from-red-200 to-red-700 flex flex-col items-center">
      <a className="flex mb-2 md:mb-5 text-white-50 text-3xl text-gray-300">
        AnyGym
      </a>
      <nav className="items-center flex md:flex-row flex-col">
        <Link
          href="/"
          className="px-4 text-xl text-white  hover:bg-gray-600 rounded-lg"
        >
          Home
        </Link>
        <Link
          href="/pages/profile"
          className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
        >
            profile
        </Link>
        <Link
          href="/pages/members"
          className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
        >
            Members
        </Link>
        <Link
          href="/pages/employments"
          className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
        >
            Employments
        </Link>
        <Link
          href="/pages/employees"
          className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
        >
            Employees
        </Link>
        <Link
          href="/pages/enrollments"
          className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
        >
            Enrollments
        </Link>
        <Link
          href="/pages/clubs"
          className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
        >
            Clubs
        </Link>
        <Link
          href="/pages/signup"
          className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
        >
            Signup
        </Link>
        {!loggedInUser && (
          <Link
            href="/pages/login"
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            Login
          </Link>         
        )}
        {loggedInUser && (
          <a
            href="/pages/login"
            onClick={handleClick}
            className="px-4 text-white text-xl hover:bg-gray-600 rounded-lg"
          >
            logout
          </a>
        )}
        {loggedInUser && (
          <div className="text-white ms-5 mt-2 md:mt-0 pt-1 md:pt-0 grow">
            {t("header.welcome")},  {loggedInUser}!
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
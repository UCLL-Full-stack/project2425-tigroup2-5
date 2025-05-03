"use client";

import Link from "next/link";
import { useAuth } from "./auth/AuthContext";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  const isEmployee = user?.role === 'employee' || isAdmin;

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
            
            {isAuthenticated && (
              <Link href="/pages/profile" className="nav-link text-white hover:bg-white/10">
                Profile
              </Link>
            )}
            
            {(isEmployee || isAdmin) && (
              <>
                <Link href="/pages/members" className="nav-link text-white hover:bg-white/10">
                  Members
                </Link>
                <Link href="/pages/enrollments" className="nav-link text-white hover:bg-white/10">
                  Enrollments
                </Link>
              </>
            )}
            
            {isAdmin && (
              <>
                <Link href="/pages/employments" className="nav-link text-white hover:bg-white/10">
                  Employments
                </Link>
                <Link href="/pages/employees" className="nav-link text-white hover:bg-white/10">
                  Employees
                </Link>
              </>
            )}
            
            <Link href="/pages/clubs" className="nav-link text-white hover:bg-white/10">
              Clubs
            </Link>
            
            {!isAuthenticated && (
              <>
                <Link href="/pages/signup" className="nav-link text-white hover:bg-white/10">
                  Signup
                </Link>
                <Link href="/pages/login" className="nav-link text-white bg-accent/80 hover:bg-accent">
                  Login
                </Link>
              </>
            )}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="nav-link text-white bg-accent/80 hover:bg-accent"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
        
        {isAuthenticated && user && (
          <div className="text-white text-sm mt-2 pb-1 text-center md:text-right">
            Welcome, <span className="font-medium">{user.firstname} {user.surname}</span>
            {user.role && <span className="ml-1 text-xs opacity-75">({user.role})</span>}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
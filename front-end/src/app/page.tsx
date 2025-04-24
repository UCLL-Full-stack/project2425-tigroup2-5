"use client";

import Link from "next/link";
import Header from "./components/header";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome to AnyGym</h1>
            <p className="mb-6 text-text-light">
              Your comprehensive gym management platform. Manage members, employees, clubs and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h2 className="text-xl font-semibold mb-2">For Members</h2>
                <p className="mb-3">View your profile, manage subscriptions, and track your enrollment.</p>
                <Link href="/pages/profile" className="btn btn-primary inline-block">
                  Go to Profile
                </Link>
              </div>
              
              <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/20">
                <h2 className="text-xl font-semibold mb-2">For Staff</h2>
                <p className="mb-3">Manage members, handle enrollments, and oversee club operations.</p>
                <Link href="/pages/employees" className="btn btn-secondary inline-block">
                  Staff Dashboard
                </Link>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/pages/clubs" className="btn btn-outline">
                Browse Clubs
              </Link>
              <Link href="/pages/signup" className="btn btn-outline">
                Sign Up
              </Link>
              <Link href="/pages/login" className="btn btn-outline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-text-light">
          © 2025 AnyGym. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
import Header from "@/app/components/header";
import Link from "next/link";

export default function Profile() {
    return (
        <div>
            <Header></Header>
            <div className="flex justify-center items-center min-h-screen ">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl text-gray-700 font-bold mb-2">Profile</h1>
                    <h2 className="text-lg text-gray-700">Welcome to your profile!</h2>
                    <Link href="/pages/subscription" className="text-blue-500 hover:text-blue-700">Go to my subscription</Link>
                </div>
            </div>
        </div>
    );
}
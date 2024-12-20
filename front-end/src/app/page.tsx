import Link from "next/link";
import Header from "./components/header";

const Home: React.FC = () => {
  return (
    <div>
    <Header></Header>
    <div className="flex justify-center items-center min-h-screen ">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl text-gray-700 font-bold mb-2">Home</h1>
            <h2 className="text-lg text-gray-700">This is the homepage</h2>
        </div>
    </div>
</div>
  );
}

export default Home;
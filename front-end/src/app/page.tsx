import Link from "next/link";
import LoginScreen from "./components/login/login";

const Home: React.FC = () => {
  return (
    <div>
      <main>
        <LoginScreen />
      </main>
    </div>
  );
}

export default Home;
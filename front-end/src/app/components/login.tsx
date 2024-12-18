
const LoginScreen = () => {

    
    return (
        <div className="flex items-center justify-center min-h-screen pt-20">
             <form className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-semibold mb-4 text-black">Login</h2>
                    <input className="mb-4 p-2 border border-gray-300 rounded w-full" type="text" placeholder="Username"/>
                    <input className="mb-4 p-2 border border-gray-300 rounded w-full" type="password" placeholder="Password" />
                    <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600" type="submit">Login</button>
                </form>
            </div>
    );
};
export default LoginScreen;
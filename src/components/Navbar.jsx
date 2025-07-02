import { Link } from "react-router-dom";

export default function Navbar( { onShowAuth, currentUser }) {
    
    return(
        <nav className="flex flex-row bg-white px-6 py-4 shadow">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
                <Link to="/" className="text-3xl font-extrabold">
                    <span className="text-black">RateMy</span>
                    <span className="text-green-700">Course</span>
                </Link>
            </div>
            <div className="flex items-center">
                {currentUser ? (
                    <Link
                    to="/account"
                    className="text-gray-700 hover:text-green-600 hover:underline font-medium"
                    >
                    My Account
                    </Link>
                ) : (
                    <button
                    onClick={onShowAuth}
                    className="text-gray-700 hover:text-green-600 hover:underline font-medium"
                    >
                    Sign In
                    </button>
                )}
            </div>
        </nav>
    )
}
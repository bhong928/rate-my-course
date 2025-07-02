import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function Account() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("settings")

    useEffect(() => {
        setUser(auth.currentUser);
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/"); // redirect to homepage after sign out
    };

    return(
        <section className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar */}
            <div className="w-full md:w-80 px-4 py-4 border border-b md:border-b-0 md:border-r">
                <h2 className="text-lg font-semibold mb-1">My Account</h2>
                <p className="text-sm mb-4">{user?.email} </p>

                <ul className="space-y-2">
                    <li 
                    onClick={() => setActiveTab("settings")}
                    className={`p-2 rounded cursor-pointer ${activeTab === "settings" ? "bg-gray-300" : "hover:bg-gray-100"}`}
                    >
                        Settings
                    </li>

                    <li 
                    onClick={() => setActiveTab("posts")}
                    className={`p-2 rounded cursor-pointer ${activeTab === "posts" ? "bg-gray-300" : "hover:bg-gray-100"}`}
                    >
                        My Posts
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8">
                <h2 className="text-xl font-semibold mb-4">
                    {activeTab === "settings" ? "Settings" : "My Posts"}
                </h2>

                <hr className="my-4 border-gray-300"/>

                {activeTab === "settings" ? (
                    <button
                    onClick={handleSignOut}
                    className="text-lg border rounded px-6 py-2 hover:bg-gray-100"
                    >
                    Sign Out
                    </button>
                ) : (
                    <p>You have no posts yet.</p>
                )}
            </div>
        </section>
    )
}
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function AuthModal({ isOpen, onClose, onGoogleSignIn, onSendEmailLink }) {
    const [email, setEmail] = useState("");

    // Don't render modal if it's closed
    if(!isOpen) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div>
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                    <IoClose size={24} />
                </button>

                {/* Google Sign In */}
                <button
                onClick={onGoogleSignIn}
                className="w-full bg-white border rounded shadow px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50"
                >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                Sign in with Google
                </button>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t" />
                    <span className="mx-2 text-sm text-gray-400">OR</span>
                    <hr className="flex-grow border-t" />
                </div>

                {/* Email Link Sign In */}
                <form>
                    <label>Sign in with one-time link</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        className="w-full border px-3 py-2 rounded mb-3 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm font-medium"
                        >
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
}
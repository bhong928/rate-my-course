import { useContext } from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute ({ children }) {

    const { currentUser, isAdmin, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return (
            <div className="text-center text-gray-600 text-sm">
                Checking Permissions
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    console.log("currentUser", currentUser?.email);
    console.log("isAdmin", isAdmin);

    return children;
}
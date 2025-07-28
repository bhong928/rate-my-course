import { useContext } from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute ({ children }) {

    const { currentUser, isAdmin } = useContext(AuthContext);

    if (!currentUser || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    console.log("currentUser", currentUser?.email);
    console.log("isAdmin", isAdmin);

    return children;
}
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    const { user } = useAuth();

    if (!user) {

        alert("Please login or register first before continuing.");

        return <Navigate to="/login" replace />;

    }

    return children;

}
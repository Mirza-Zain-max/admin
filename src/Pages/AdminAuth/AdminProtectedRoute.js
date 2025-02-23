import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../Context/AdminAuthContext";

const AdminProtectedRoute = () => {
    const { isAdmin, isLoading } = useAdminAuth();

    if (isLoading) return null; // Wait until auth check is complete

    return isAdmin ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default AdminProtectedRoute;

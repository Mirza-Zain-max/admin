import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
    const userRole = localStorage.getItem("user-role");

    if (userRole !== "admin") {
        return <Navigate to="/" />;
    }


    return <Outlet />;
};

export default AdminRoutes;

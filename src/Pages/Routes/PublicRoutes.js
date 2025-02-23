import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../Context/Auth";

const PublicRoutes = () => {
    const { isAuth } = useAuthContext();
    return !isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;

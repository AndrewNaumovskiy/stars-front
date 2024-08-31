import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth = () => {
    if (localStorage.getItem("token") !== null)
        return <Outlet />;

    return (
        <Navigate
            to="/login"
            replace
        />
    );
};
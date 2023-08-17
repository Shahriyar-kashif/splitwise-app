import { useSelector } from "react-redux";
import { authSelector } from "../../store/authSlice";
import { Outlet } from "react-router";

export default function User() {
    const userAuth = useSelector(authSelector);
    return(
        <>
            <Outlet />
        </>
    )
}

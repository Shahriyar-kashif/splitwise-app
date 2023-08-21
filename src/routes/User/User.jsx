import { useSelector } from "react-redux";
import { authSelector } from "../../store/authSlice";
import UserPanel from "../../components/UserPanel/UserPanel";
import { Box } from "@mui/system";
import { Outlet } from "react-router";

export default function User() {
    const userAuth = useSelector(authSelector);
    console.log(userAuth);
    return(
        <>
        <UserPanel />
        <Outlet />
        </>

    )
}

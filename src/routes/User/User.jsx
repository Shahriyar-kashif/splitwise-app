import { useSelector } from "react-redux";
import { authSelector } from "../../store/authSlice";

export default function User() {
    const userAuth = useSelector(authSelector);
    console.log(userAuth);
    return(
        <>
        <h1>User Profile</h1>
        {(userAuth !==null) && <p>{userAuth.id}</p>}
        </>
    )
}

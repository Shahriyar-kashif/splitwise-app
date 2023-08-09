import { Navigate, Outlet } from "react-router-dom";
import { authSelector } from "../../store/authSlice";
import { authorizeUser } from "../../store/authSlice";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const userAuth = useSelector(authSelector);
  console.log(userAuth)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        dispatch(authorizeUser({
            id:user.uid,
            firstName: user.firstName,
            lastName: user.lastName,
        }));
      }
    });
  }, [auth]);

  return <>{userAuth ? <Outlet /> : <Navigate to="/login" />}</>;
}

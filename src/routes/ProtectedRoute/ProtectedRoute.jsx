import { Outlet, useNavigate } from "react-router-dom";
import { authorizeUser } from "../../store/authSlice";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useDispatch } from "react-redux";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Protected runs?')
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(authorizeUser({id:user.uid}));
      } else{
        navigate('/login');
      }
    });
  }, []);

    return (
        <Outlet />
    )
}

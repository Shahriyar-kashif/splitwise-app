import Navbar from "../../components/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../../firebase/firebase";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) navigate("/user");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <ToastContainer position="top-left" />
      <Outlet />
    </>
  );
}

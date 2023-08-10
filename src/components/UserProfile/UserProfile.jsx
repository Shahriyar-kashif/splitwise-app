import { useSelector } from "react-redux";
import { redirect, useLoaderData, useNavigate, useParams } from "react-router";
import { authSelector } from "../../store/authSlice";
import { Box, Typography } from "@mui/material";
import { doc, getDoc } from "@firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useEffect } from "react";
export default function UserProfile() {
  const userData = useLoaderData();
  const navigate = useNavigate();
  const path = useParams();
  console.log(path);
  useEffect(() => {
    if (!userData) {
      onAuthStateChanged(auth, (user) => {
        navigate(`/user/${user.uid}`);
      });
    }
  }, []);

  console.log(userData);
  return (
    <Box sx={{ width: 2 / 4, ml: "5%", mt: 5 }}>
      {userData && (
        <Typography component="h1" variant="h5">
          Welcome, {userData.firstName} {userData.lastName}
        </Typography>
      )}
    </Box>
  );
}

export async function loader({ params }) {
  const userId = params.userId;
  console.log(userId);
  const userRef = doc(db, "users-db", userId);
  const userSnap = await getDoc(userRef);
  console.log(userSnap.exists());
  if (userSnap.exists()) {
    const userData = userSnap.data();
    return userData;
  } else {
    return null;
  }
}

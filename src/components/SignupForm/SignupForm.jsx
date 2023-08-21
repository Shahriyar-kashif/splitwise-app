import {
  Container,
  CssBaseline,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [submissionError, setSubmissionError] = useState(null);
  const [disableState, setDisableState] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e, setChange) => {
    const value = e.target.value;
    console.log(/^[a-zA-Z]*$/.test(value));
    if (/^[a-zA-Z]*$/.test(value) || value === "") setChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const [firstName, lastName] = [
      formData.get("firstName"),
      formData.get("lastName"),
    ];
    setDisableState(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        if (submissionError) setSubmissionError(null);
        setDoc(doc(db, "users-db", user.uid), {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
        });
        toast.success("Sign up Successful! You're Now Logged In");
        updateProfile(auth.currentUser, {
          displayName: `${firstName} ${lastName}`,
        });
        navigate(`/user`);
      })
      .catch((error) => {
        if (error.message.includes("auth/weak-password"))
          setSubmissionError("Password should be at least 6 characters");
        else if (error.message.includes("auth/email-already-in-use"))
          setSubmissionError("Email already registered");
        else setSubmissionError(error.message);
      })
      .finally(() => {
        setDisableState(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          Sign up
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                value={firstName}
                onChange={(e) => {
                  handleInputChange(e, setFirstName);
                }}
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  handleInputChange(e, setLastName);
                }}
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="email"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                name="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={disableState}
          >
            Sign up
          </Button>
          {submissionError && (
            <Typography
              component="p"
              sx={{ color: "red", textAlign: "center" }}
            >
              {submissionError}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link variant="body2" component={RouterLink} to="/login">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

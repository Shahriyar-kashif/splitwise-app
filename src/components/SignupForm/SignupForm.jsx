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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export default function SignupForm() {
  const [submissionError, setSubmissionError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const [firstName, lastName] = [formData.get('firstName'), formData.get('lastName')];
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        if (submissionError) setSubmissionError(null);
        setDoc(doc(db, "users-db", user.uid), {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
        });

        navigate(`/user/${user.uid}`);
      })
      .catch((error) => {
        setSubmissionError(error.message);
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
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
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

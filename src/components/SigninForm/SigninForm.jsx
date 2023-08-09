import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";

export default function SigninForm() {
  const [submissionError, setSubmissionError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);
        if (submissionError) setSubmissionError(null);
        navigate(`/user/${user.uid}`);
      })
      .catch((error) => {
        setSubmissionError(error.message);
      });
  };

  return (
    <Container component="main" maxwidth="xs">
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
          Sign in
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
              <TextField
                name="email"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
              />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign in
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
              <Link variant="body2" component={RouterLink} to="/signup">
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

import {
  Box,
  Select,
  Button,
  Container,
  CssBaseline,
  InputLabel,
  TextField,
  Modal,
  MenuItem,
  Typography,
} from "@mui/material";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import { useLoaderData, useParams } from "react-router";
import { useRef, useState } from "react";
import { db } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  addParticipants,
  participantsSelector,
} from "../../store/participantsSlice";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddContributers({ open, setClose }) {
  const users = useLoaderData();
  const [email, setEmail] = useState("");
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const dispatch = useDispatch();
  const participants = useSelector(participantsSelector);
  //   const currentUserParam = useParams();
  console.log(participants);

  const handleChange = (event) => {
    console.log(event.target.value);
    setEmail(event.target.value);
  };

  const handleParticipants = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userEmail = formData.get("contributors");
    const usersRef = collection(db, "users-db");
    const matchedUser = query(usersRef, where("email", "==", userEmail));
    const userSnapShot = await getDocs(matchedUser);
    // console.log(useSnapShot.docs[0]);
    if (!userSnapShot.empty) {
      const userDoc = userSnapShot.docs[0];
      const participantExpense = {
        id: userDoc.id,
        contribution: formData.get("contribution"),
        bill: formData.get("bill"),
      };
      dispatch(addParticipants(participantExpense));
      setCurrentParticipant(userEmail);
    }
  };

  console.log(users);
  return (
    <Modal open={open}>
      <Container component="main" maxwidth="xs" sx={style}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" sx={{ mt: 3 }} onSubmit={handleParticipants}>
            <InputLabel id="contributors-email">Search by Email</InputLabel>
            <Select
              labelId="contributors-email"
              id="contributors"
              name="contributors"
              value={email}
              //   input={<OutlinedInput label="Search by Email" />}
              MenuProps={MenuProps}
              onChange={handleChange}
              sx={{ width: "100%" }}
            >
              {users.map((user) => {
                return (
                  <MenuItem key={user.email} value={user.email}>
                    {user.email}
                  </MenuItem>
                );
              })}
            </Select>
            <TextField
              margin="normal"
              required
              fullWidth
              id="bill"
              label="bill"
              type="number"
              name="bill"
              autoComplete="current-bill"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="contribution"
              label="contribution"
              type="number"
              name="contribution"
              autoComplete="current-contribution"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Done
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={setClose}
            >
              Close
            </Button>
            {currentParticipant && (
              <Typography component="p" sx={{color:'green'}}>
                {currentParticipant} added successfully!
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}

export async function loader() {
  const usersSnapshot = await getDocs(collection(db, "users-db"));
  const users = [];
  usersSnapshot.forEach((doc) => users.push(doc.data()));
  return users;
}

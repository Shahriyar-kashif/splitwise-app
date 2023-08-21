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
import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";
import { useLoaderData } from "react-router";
import { useState, useRef } from "react";
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

export default function AddContributers({
  open,
  setClose,
  totalBill,
  userBill,
  userContribution,
}) {
  const [, users] = useLoaderData();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [amountError, setAmountError] = useState("");
  const contributionRef = useRef();
  const billRef = useRef();
  const contributorRef = useRef();
  const dispatch = useDispatch();
  const participants = useSelector(participantsSelector);
  const signedInUserBill = Number(userBill) || 0;
  const signedInUserContribution = Number(userContribution) || 0;

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const checkParticipantRepetition = (participants, email) => {
    const repeatedParticipant = participants.find(
      (participant) => participant.email === email
    );
    return repeatedParticipant;
  };

  const compareBillAndContribution = (
    participants,
    participantBill,
    participantContribution
  ) => {
    const participantPayment = compareAmount(participants) || {
      bill: 0,
      contribution: 0,
    };

    return (
      participantPayment.bill + participantBill + signedInUserBill >
        totalBill ||
      participantPayment.contribution +
        participantContribution +
        signedInUserContribution >
        totalBill ||
      participantContribution > totalBill ||
      participantBill > totalBill
    );
  };

  const compareAmount = (participants) => {
    if (participants.length > 0) {
      const totalBill = participants.reduce((accum, current) => {
        return {
          bill: Number(accum.bill) + Number(current.bill),
          contribution:
            Number(accum.contribution) + Number(current.contribution),
        };
      });
      return {
        bill: totalBill.bill,
        contribution: totalBill.contribution,
      };
    }
  };

  const handleParticipants = async () => {
    const [userEmail, userBill, userContribution] = [
      contributorRef.current.value,
      Number(billRef.current.value),
      Number(contributionRef.current.value),
    ];
    const usersRef = collection(db, "users-db");
    const matchedUser = query(usersRef, where("email", "==", userEmail));
    const userSnapShot = await getDocs(matchedUser);

    if (checkParticipantRepetition(participants, userEmail)) {
      setErrorMessage(true);
      return;
    } else setErrorMessage(false);

    if (compareBillAndContribution(participants, userBill, userContribution)) {
      setAmountError(true);
      return;
    } else setAmountError(false);

    if (!userSnapShot.empty) {
      const userDoc = userSnapShot.docs[0];
      const participantExpense = {
        id: userDoc.id,
        contribution: userContribution,
        bill: userBill,
        name: `${userDoc.data().firstName} ${userDoc.data().lastName}`,
        email: userEmail,
      };
      dispatch(addParticipants(participantExpense));
      setCurrentParticipant(userEmail);
    }
  };

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
          <Box component="div" sx={{ mt: 3 }}>
            <InputLabel id="contributors-email">Search by Email</InputLabel>
            <Select
              labelId="contributors-email"
              id="contributors"
              inputRef={contributorRef}
              name="contributors"
              value={email}
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
              inputRef={billRef}
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
              inputRef={contributionRef}
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
              onClick={handleParticipants}
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
              <Typography component="p" sx={{ color: "green" }}>
                {currentParticipant} added successfully!
              </Typography>
            )}
            {errorMessage && (
              <Typography component="p" sx={{ color: "red" }}>
                {currentParticipant} has already been added!
              </Typography>
            )}
            {amountError && (
              <Typography component="p" sx={{ color: "red" }}>
                Contribution or bill cannot exceed total bill
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}

export async function loader({ params }) {
  const usersSnapshot = await getDocs(collection(db, "users-db"));
  const users = [];
//   usersSnapshot.forEach((doc) => users.push(doc.data()));
//   return users;
  const userId = params.userId;
  const userRef = doc(db, "users-db", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    usersSnapshot.forEach((doc) => users.push(doc.data()));
    return [userData, users];
  } else {
    return [null, []];
  }
}

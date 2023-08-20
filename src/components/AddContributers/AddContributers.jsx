import SkeletonUI from "../SkeletonUI/SkeletonUI";
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
import { collection, getDocs, query, where } from "@firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  addParticipants,
  participantsSelector,
} from "../../store/participantsSlice";
import { fetchUserData, fetchUsers } from "../../Utilities/firebaseUtilities";
import { toast } from "react-toastify";
import { authSelector } from "../../store/authSlice";
import { isExpenseValid, isParticipantAlreadyAdded } from "../../Utilities/participantsValidationsUtils";

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
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [amountError, setAmountError] = useState("");
  const [negativeValError, setNegativeValError] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const contributionRef = useRef();
  const billRef = useRef();
  const contributorRef = useRef();
  const dispatch = useDispatch();
  const participants = useSelector(participantsSelector);
  const signedInUserBill = Number(userBill) || 0;
  const signedInUserContribution = Number(userContribution) || 0;
  const userAuth = useSelector(authSelector);

  useEffect(() => {
    fetchUsers(userAuth)
      .then((users) => {
        setUsers([...users]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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

    if (isParticipantAlreadyAdded(participants, userEmail)) {
      setErrorMessage(true);
      return;
    } else setErrorMessage(false);

    if (
      isExpenseValid(
        participants,
        userBill,
        userContribution,
        signedInUserBill,
        signedInUserContribution,
        totalBill
      )
    ) {
      setAmountError(true);
      return;
    } else setAmountError(false);

    if (userBill < 0 || userContribution < 0) {
      setNegativeValError(true);
      return;
    } else setNegativeValError(false);

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
      toast.success("Contributor added successfully!");
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
              onChange={handleEmailChange}
              sx={{ width: "100%" }}
            >
              {isLoading && (
                <MenuItem>
                  <SkeletonUI />
                </MenuItem>
              )}
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
              label="Add order bill of the contributor"
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
              label="Add amount paid by the contributor"
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
              <Typography component="p" sx={{ color: "green" }} align="center">
                {currentParticipant} added successfully!
              </Typography>
            )}
            {errorMessage && (
              <Typography component="p" sx={{ color: "red" }} align="center">
                {currentParticipant} has already been added!
              </Typography>
            )}
            {amountError && (
              <Typography component="p" sx={{ color: "red" }} align="center">
                Contribution or bill cannot exceed total bill
              </Typography>
            )}
            {negativeValError && (
              <Typography component="p" sx={{ color: "red" }} align="center">
                Negative values are not acceptable
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}

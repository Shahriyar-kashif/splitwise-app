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
import { fetchUsers } from "../../Utilities/firebaseUtilities";
import { toast } from "react-toastify";
import { authSelector } from "../../store/authSlice";
import {
  isExpenseValid,
  isParticipantAlreadyAdded,
} from "../../Utilities/participantsValidationsUtils";
import { USERS_COLLECTION } from "../../constants/constants";
import PropTypes from 'prop-types';

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
  signedInUserBill = 0,
  signedInUserContribution = 0,
  menuProps,
}) {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [currentParticipant, setCurrentParticipant] = useState(null);
    const [amountError, setAmountError] = useState("");
    const [negativeValError, setNegativeValError] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [disableAddBtn, setDisableAddBtn] = useState(false);
    const contributionRef = useRef();
    const billRef = useRef();
    const contributorRef = useRef();
    const dispatch = useDispatch();
    const participants = useSelector(participantsSelector);
    const userAuth = useSelector(authSelector);

    useEffect(() => {
      fetchUsers(userAuth)
        .then((users) => {
          setUsers([...users]);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setIsLoading(false);
        });
    }, [userAuth]);

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };

    const handleParticipants = async () => {
      setDisableAddBtn(true);
      const [userEmail, userBill, userContribution] = [
        contributorRef.current.value,
        Number(billRef.current.value),
        Number(contributionRef.current.value),
      ];

      const usersRef = collection(db, USERS_COLLECTION);
      const matchedUser = query(usersRef, where("email", "==", userEmail));
      const userSnapShot = await getDocs(matchedUser);

      if (isParticipantAlreadyAdded(participants, userEmail)) {
        setErrorMessage(true);
        setDisableAddBtn(false);
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
        setDisableAddBtn(false);
        return;
      } else setAmountError(false);

      if (userBill < 0 || userContribution < 0) {
        setNegativeValError(true);
        setDisableAddBtn(false);
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
        setDisableAddBtn(false);
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
              MenuProps={menuProps}
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
              disabled={disableAddBtn}
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

AddContributers.propTypes = {
  open: PropTypes.bool.isRequired,
  setClose: PropTypes.func.isRequired,
  totalBill: PropTypes.number.isRequired,
  signedInUserBill: PropTypes.number.isRequired,
  signedInUserContribution: PropTypes.number.isRequired,
  menuProps: PropTypes.object.isRequired,
}

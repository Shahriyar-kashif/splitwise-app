import AddContributers from "../AddContributers/AddContributers";
import ContributorsTable from "../ContributorsTable/ContributorsTable";
import {
  Box,
  Button,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Input,
  Typography,
  Grid,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearParticpants,
  participantsSelector,
} from "../../store/participantsSlice";
import { db, storage } from "../../firebase/firebase";
import { ref, uploadBytes } from "@firebase/storage";
import { v4 } from "uuid";
import { authSelector } from "../../store/authSlice";
import {
  addDoc,
  arrayUnion,
  collection,
  updateDoc,
  doc,

} from "@firebase/firestore";
import {
  fetchUserData,
  uploadImageToDB,
} from "../../Utilities/firebaseUtilities";
import { toast } from "react-toastify";
import { calculateCumulativeExpense } from "../../Utilities/participantsValidationsUtils";
import { isExpenseAlreadySettled, submitExpenseToDB } from "../../Utilities/expenseFormUtils";


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

const currencies = [
  "USD",
  "EUR",
  "GPB",
  "PKR",
  "JPY",
  "AUD",
  "CAD",
  "AED",
  "CHF",
  "INR",
];

export default function ExpenseForm() {
  const [openModal, setOpenModal] = useState(false);
  const [disable, setDisable] = useState(true);
  const [disableFormButton, setDisableFormButton] = useState(false);
  const [currency, setCurrency] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [settlementError, setSettlementError] = useState(false);
  const participants = useSelector(participantsSelector);
  const totalBillRef = useRef();
  const userBillRef = useRef();
  const userContributionRef = useRef();
  const dispatch = useDispatch();
  const userAuth = useSelector(authSelector);

  useEffect(() => {
    fetchUserData(userAuth).then((userData) => {
      setUserData(userData);
    }); // add catch block
    return () => {
      dispatch(clearParticpants());
    };
  }, []);

  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const handleDisable = (e) => {
    if (e.target.value > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  const handleCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const handleImageChange = (e) => {
    const uploadedFile = e.target.files[0];
    setUploadedImage(uploadedFile);
  };

  const handleExpenseAddition = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userContribution = Number(formData.get("userContribution")) || 0;
    const userBill = Number(formData.get("userBill")) || 0;
    const totalBill = Number(formData.get("totalBill"));
    const imagePath = uploadImageToDB(uploadedImage);
    const currentUser = {
      id: userAuth.id,
      email: userData?.email,
      name: `${userData?.firstName} ${userData?.lastName}`,
      contribution: userContribution,
      bill: Number(formData.get("userBill")),
    };
    const expense = {
      description: formData.get("description"),
      totalBill: Number(formData.get("totalBill")),
      date: formData.get("date"),
      currency: formData.get("currency"),
      image: imagePath ?? null,
      participants: [currentUser, ...participants],
    };
    const totalExpense = calculateCumulativeExpense(
      participants,
      userBill,
      userContribution
    );
    if (
      totalExpense.bill !== totalBill ||
      totalExpense.contribution !== totalBill
    ) {
      setErrorMessage(true);
      return;
    } else setErrorMessage(false);
    if (
      userBill === userContribution &&
      isExpenseAlreadySettled(participants)
    ) {
      setSettlementError(true);
      e.target.reset();
      dispatch(clearParticpants());
      return;
    } else setSettlementError(false);
    setDisableFormButton(true);
    submitExpenseToDB(userAuth, participants, expense, setDisableFormButton);
    e.target.reset();
  };

  return (
    <Box sx={{ width: "50%", ml: "auto", mr: "auto" }}>
      <Box component="form" sx={{ mt: 3 }} onSubmit={handleExpenseAddition}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Add Expense Description"
          type="string"
          name="description"
          autoComplete="current-description"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="date"
              type="date"
              name="date"
              autoComplete="current-date"
              inputProps={{ max: new Date().toISOString().split("T")[0] }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              inputRef={totalBillRef}
              fullWidth
              id="total-bill"
              inputProps={{ min: 0 }}
              label="Total Bill"
              type="number"
              onChange={handleDisable}
              name="totalBill"
              autoComplete="current-bill"
            />
          </Grid>
        </Grid>
        <InputLabel id="select-currency">Select Currency</InputLabel>
        <Select
          labelId="select-currency"
          id="currency"
          name="currency"
          value={currency}
          MenuProps={MenuProps}
          onChange={handleCurrency}
          sx={{ width: "100%" }}
        >
          {currencies.map((currency) => {
            return (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            );
          })}
        </Select>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user-bill"
              inputRef={userBillRef}
              label="Add your order bill"
              type="number"
              inputProps={{ min: 0 }}
              name="userBill"
              autoComplete="current-bill"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user-contribution"
              label="Add your payment"
              inputRef={userContributionRef}
              type="number"
              inputProps={{ min: 0 }}
              name="userContribution"
              autoComplete="current-contribution"
            />
          </Grid>
        </Grid>
        <Button variant="contained" disabled={disable} onClick={handleOpen}>
          Add Contributors
        </Button>
        {openModal && (
          <AddContributers
            totalBill={totalBillRef.current.value}
            setClose={handleClose}
            open={openModal}
            userBill={userBillRef.current.value}
            userContribution={userContributionRef.current.value}
          />
        )}
        {participants.length > 0 && <ContributorsTable currency={currency} />}
        <InputLabel htmlFor="image" sx={{ mt: 2 }}>
          Add Image
        </InputLabel>
        <Input
          type="file"
          id="image"
          name="image"
          inputProps={{ accept: "image/*", "aria-label": "choose image" }}
          sx={{ mb: 1 }}
          onChange={handleImageChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={disableFormButton}
        >
          Add Expense
        </Button>
        {errorMessage && (
          <Typography
            component="p"
            variant="p"
            sx={{ color: "red" }}
            align="center"
          >
            Bills and Contributions don't add up to total bill
          </Typography>
        )}
        {settlementError && (
          <Typography
            component="p"
            variant="p"
            sx={{ color: "red" }}
            align="center"
          >
            An already settled expense cannot be added
          </Typography>
        )}
      </Box>
    </Box>
  );
}

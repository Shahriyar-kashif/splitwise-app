import AddContributers from "../AddFriend/AddContributers";
import ContributorsTable from "../ContributorsTable/ContributorsTable";
import {
  Box,
  Button,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Input,
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
  const [currency, setCurrency] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const participants = useSelector(participantsSelector);
  const totalBillRef = useRef();
  const dispatch = useDispatch();
  const userAuth = useSelector(authSelector);

  useEffect(() => {
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
    console.log(event.target.value);
    setCurrency(event.target.value);
  };

  const handleImageChange = (e) => {
    const uploadedFile = e.target.files[0];
    console.log(uploadedFile);
    setUploadedImage(uploadedFile);
  };

  const handleExpenseAddition = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const [userContribution, userBill] = [
      Number(
        formData.get("userContribution"),
        Number(formData.get("userBill"))
      ),
    ];
    const imagePath = uploadedImage
      ? `images/${uploadedImage.name + v4()}`
      : null;
    const imageRef = imagePath && ref(storage, `${imagePath}`);
    if (imageRef) {
        uploadBytes(imageRef, uploadedImage).then(() => {
            console.log("image uploaded");
          });
    }
    const currentUser = {
      id: userAuth.id,
      contribution: userContribution,
      bill: formData.get("userBill"),
    };
    const expense = {
      description: formData.get("description"),
      totalBill: Number(formData.get("totalBill")),
      date: formData.get("date"),
      image: imagePath,
      participants: [currentUser, ...participants],
    };
    console.log(expense);
    // get reference to expense collection and add the expense form data as a doc there
    const expenseRef = collection(db, "expense");
    const expenseDocRef = await addDoc(expenseRef, expense);
    // get reference to current user's doc in db
    const userDocRef = doc(db, "users-db", userAuth.id);
    // add current expense doc's id to the user's doc in an array
    await updateDoc(userDocRef, {
      expenses: arrayUnion(expenseDocRef.id),
    });
    // do the above for all participants in the expense as well
    participants.forEach(async (participant) => {
      await updateDoc(doc(db, "users-db", participant.id), {
        expenses: arrayUnion(expenseDocRef.id),
      });
    });
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="date"
          type="date"
          name="date"
          autoComplete="current-date"
        />
        <InputLabel id="select-currency">Select Currency</InputLabel>
        <Select
          labelId="select-currency"
          id="currency"
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
        <TextField
          margin="normal"
          required
          inputRef={totalBillRef}
          fullWidth
          id="total-bill"
          label="Total Bill"
          type="number"
          onChange={handleDisable}
          name="totalBill"
          autoComplete="current-bill"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="user-bill"
          label="Add your bill"
          type="number"
          name="userBill"
          autoComplete="current-bill"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="user-contribution"
          label="Add your contribution"
          type="number"
          name="userContribution"
          autoComplete="current-contribution"
        />
        <Button variant="contained" disabled={disable} onClick={handleOpen}>
          Add Contributors
        </Button>
        {openModal && (
          <AddContributers
            totalBill={totalBillRef.current.value}
            setClose={handleClose}
            open={openModal}
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
        >
          Add Expense
        </Button>
      </Box>
    </Box>
  );
}

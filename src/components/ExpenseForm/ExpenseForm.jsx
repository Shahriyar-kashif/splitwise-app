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
  const participants = useSelector(participantsSelector);
  const totalBillRef = useRef();
  const dispatch = useDispatch();

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

  return (
    <Box sx={{ width: "50%", ml: "auto", mr: "auto" }}>
      <Box component="form" sx={{ mt: 3 }}>
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
          id="total-amount"
          label="Total Amount"
          type="number"
          onChange={handleDisable}
          name="totalAmount"
          autoComplete="current-bill"
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
        <InputLabel id="select-image" sx={{mt:2}}>Add Image</InputLabel>
        <Input
          type="file"
          labelId="select-image"
          inputProps={{ accept: "image/*", "aria-label": "choose image" }}
          sx={{ mb: 1 }}
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

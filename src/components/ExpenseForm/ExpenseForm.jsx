import {
  Box,
  Button,
  InputLabel,
  Select,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import AddContributers from "../AddFriend/AddContributers";

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
    <Box sx={{ width: "50%", ml: "auto", mr: "auto", mt: 10 }}>
      <Box component="form" sx={{ mt: 3 }}>
        <InputLabel id="select-currency">Select Currency</InputLabel>
        <Select
          labelId="select-currency"
          id="currency"
          value={currency}
          //   input={<OutlinedInput label="Select Currency" />}
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
          <AddContributers setClose={handleClose} open={openModal} />
        )}
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

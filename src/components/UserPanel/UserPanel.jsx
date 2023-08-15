import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function UserPanel() {
  const [value, setValue] = useState(0);
  const path = useParams();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="user-panel"
        centered
      >
        <Tab
          label="Dashboard"
          component={Link}
          to={`/user/${path.userId}`}
          index={0}
        />
        <Tab label="All Expenses" index={1}
        component={Link}
        to="all-expenses"/>
        <Tab
          label="Add Expense"
          component={Link}
          to={"add-expense"}
          index={2}
        />
      </Tabs>
    </Box>
  );
}

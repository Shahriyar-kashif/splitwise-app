import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { authSelector, clearUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const drawerWidth = 240;

export default function Navbar(props) {
  const userAuth = useSelector(authSelector);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      dispatch(clearUser());
    });
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MoneyMate
      </Typography>
      <Divider />
      <List>
        {userAuth && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={`/user/${userAuth.id}`}
                sx={{ textAlign: "center" }}
              >
                {userAuth && <ListItemText primary="Dashboard" />}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={`/user/${userAuth.id}/all-expenses`}
                sx={{ textAlign: "center" }}
              >
                {userAuth && <ListItemText primary="All expenses" />}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={`/user/${userAuth.id}/add-expense`}
                sx={{ textAlign: "center" }}
              >
                {userAuth && <ListItemText primary="Add Expense" />}
              </ListItemButton>
            </ListItem>
          </>
        )}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/login"
            onClick={handleLogout}
            sx={{ textAlign: "center" }}
          >
            {userAuth && <ListItemText primary="Log out" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/login"
            sx={{ textAlign: "center" }}
          >
            {!userAuth && <ListItemText primary="Log in" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/signup"
            sx={{ textAlign: "center" }}
          >
            {!userAuth && <ListItemText primary="Sign up" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", mb: 5 }}>
      <CssBaseline />
      <AppBar component="nav" position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "block",
                textDecoration: "none",
                color: "#fff",
              },
            }}
          >
            MoneyMate
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {!userAuth && (
              <Button component={Link} to="/login" sx={{ color: "#fff" }}>
                Log in
              </Button>
            )}
            {!userAuth && (
              <Button component={Link} to="/signup" sx={{ color: "#fff" }}>
                Sign up
              </Button>
            )}
            {userAuth && (
              <>
                <Button
                  component={Link}
                  to={`/user/${userAuth.id}`}
                  sx={{ color: "#fff" }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  to={`/user/${userAuth.id}/all-expenses`}
                  sx={{ color: "#fff" }}
                >
                  All Expenses
                </Button>
                <Button
                  component={Link}
                  to={`/user/${userAuth.id}/add-expense`}
                  sx={{ color: "#fff" }}
                >
                  Add Expense
                </Button>
                <Button
                  onClick={handleLogout}
                  component={Link}
                  to="/signup"
                  sx={{ color: "#fff" }}
                >
                  Log out
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

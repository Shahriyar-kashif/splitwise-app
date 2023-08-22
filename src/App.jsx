import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import Root from "./routes/Root/Root";
import Home from "./routes/Home/Home";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import User from "./routes/User/User";
import Dashboard from "./routes/Dashboard/Dashboard";
import AddExpense from "./routes/AddExpense/AddExpense";
import AllExpenses from "./routes/AllExpenses/AllExpenses";
import { Provider, useSelector } from "react-redux";
import { authSelector } from "./store/authSlice";
import Signin from "./routes/Signin/Signin";
import Signup from "./routes/Signup/Signup";
import { store } from "./store/store";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./themes/theme";

export default function App() {
      const userAuth = useSelector(authSelector);
  console.log(userAuth);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: !userAuth ? <Home /> : <Dashboard />,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/user",
              element: <User />,
              children: [
                {
                  path: "/user",
                  element: <Dashboard />,
                },
                {
                  path: "add-expense",
                  element: <AddExpense />,
                },
                {
                  path: "all-expenses",
                  element: <AllExpenses />,
                },
                {
                  path: "*",
                  element: <Dashboard />,
                },
              ],
            },
          ],
        },
        {
          path: "/login",
          element: !userAuth ? <Signin /> : <Dashboard />,
        },
        {
          path: "/signup",
          element: !userAuth ? <Signup /> : <Dashboard />,
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

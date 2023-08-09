import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root/Root";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./themes/theme";
import Home from "./routes/Home/Home";
import Signup from "./routes/Signup/Signup";
import Signin from "./routes/Signin/Signin";
import User from "./routes/User/User";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./store/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path:"/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/user/:userId",
            element: <User />,
          },
        ]
      },
      {
        path: "/login",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import Signin from './components/Signin';
import { ThemeProvider } from "@emotion/react";
import { theme } from "./themes/theme";
import Signup from "./components/Signup";
import Home from "./routes/Home";
const router = createBrowserRouter([
  {
    path:"/",
    element: <Root />,
    children:[
      {
        path:'/',
        element:<Home />,
      },
      {
        path:'/login',
        element:<Signin />,
      },
      {
        path:'/signup',
        element:<Signup />
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>
);

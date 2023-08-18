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
import Dashboard from "./routes/Dashboard/Dashboard";
import AddExpense from "./routes/AddExpense/AddExpense";
import AllExpenses from "./routes/AllExpenses/AllExpenses";
import App from "./App";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/",
//         element: <ProtectedRoute />,
//         children: [
//           {
//             path: "/user",
//             element: <User />,
//             children: [
//               {
//                 path: "/user",
//                 element: <Dashboard />,
//               },
//               {
//                 path: "add-expense",
//                 element: <AddExpense />,
//               },
//               {
//                 path: "all-expenses",
//                 element: <AllExpenses />,
//               },
//               {
//                 path:"*",
//                 element: <Dashboard />,
//               }
//             ],
//           },
//         ],
//       },
//       {
//         path: "/login",
//         element: <Signin />,
//       },
//       {
//         path: "/signup",
//         element: <Signup />,
//       },
//     ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
      <App />
  </Provider>
  // </React.StrictMode>
);

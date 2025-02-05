import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store.js";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import { ToastContainer } from "react-toastify";
import Signup from "./pages/Signup.jsx";

// console.log(authStatus)
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="verify-email/:username" element={<VerifyEmail />} />
      <Route path="forgotpass" element={<ForgotPassword />} />
      <Route path="updatepass" element={<UpdatePassword />} />
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer />
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);

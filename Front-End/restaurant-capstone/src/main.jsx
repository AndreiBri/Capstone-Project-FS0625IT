import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./features/store/store.js";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Venue from "./pages/Venue.jsx";
import Menu from "./pages/Menu.jsx";
import Eventi from "./pages/Eventi.jsx";
import Login from "./pages/Login.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "venue/:venueId", element: <Venue /> },
      { path: "menu/:venueId", element: <Menu /> },
      { path: "events/:venueId", element: <Eventi /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

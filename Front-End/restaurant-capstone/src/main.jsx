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
import BookingForm from "./pages/BookingForm.jsx";

//import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./features/store/store.js";
import EventDetails from "./pages/EventDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "venue/:venueId", element: <Venue /> },
      { path: "menu/:venueId", element: <Menu /> },
      { path: "events/:venueId", element: <Eventi /> },
      { path: "events/:venueId/:eventId", element: <EventDetails /> },
      { path: "booking/form", element: <BookingForm /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
);

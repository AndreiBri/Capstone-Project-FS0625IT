import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import MyNavbar from "./components/MyNavbar";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#1a0526] flex flex-col">
        <ScrollToTop />
        <CookieBanner />
        <MyNavbar />
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;

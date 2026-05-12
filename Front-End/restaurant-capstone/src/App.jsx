import { Outlet } from "react-router-dom";
import "./App.css";
import MyNavbar from "./components/MyNavbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#1a0526] flex flex-col">
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

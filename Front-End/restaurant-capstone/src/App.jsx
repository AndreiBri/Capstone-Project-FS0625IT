import { Outlet } from "react-router-dom";
import "./App.css";
import MyNavbar from "./components/MyNavbar";

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#1a0526]">
        <header>
          <MyNavbar />
        </header>
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;

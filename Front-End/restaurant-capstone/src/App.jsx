import "./App.css";
import MyNavbar from "./components/MyNavbar";

function App() {
  return (
    <>
      <header className="min-h-screen bg-[#1a0526]">
        <MyNavbar />
      </header>
      <section id="center">
        <div className="hero"></div>
      </section>
    </>
  );
}

export default App;

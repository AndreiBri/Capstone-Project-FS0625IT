import { useState } from "react";
import { NavLink } from "react-router-dom";
import { subscribeNewsletter } from "../features/helper/api";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    try {
      await subscribeNewsletter(email);
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus(null), 400);
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-[#1C0127] font-sans border-t border-[#A06CD5]/30">
      <div className="container px-6 py-12 mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Newsletter */}
          <div className="lg:w-2/5">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-[#DABFFF] mb-6">
              Iscriviti alla newsletter per non perderti i prossimi eventi.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="La tua email"
                className="flex-1 px-5 py-3 text-white bg-[#320842]/50 border border-[#A06CD5]/30 rounded-xl focus:border-[#A06CD5] focus:outline-none focus:ring-2 focus:ring-[#A06CD5]/40 placeholder:text-[#DABFFF]/60"
              />
              <button
                onClick={handleSubscribe()}
                className="px-8 py-3 text-base font-medium text-white bg-[#A06CD5] rounded-xl hover:bg-[#8a5bc0] transition-all duration-300 hover:shadow-xl hover:shadow-[#A06CD5]/40 whitespace-nowrap"
              >
                Iscriviti
              </button>
            </div>

            {status === "success" && <p className="text-emerald-400 text-xs mt-3">Iscrizione avvenuta con successo!</p>}
            {status === "error" && <p className="text-red-400 text-xs mt-3">Inserisci un'email valida.</p>}
          </div>

          {/* Link columns */}
          <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {/* Scopri */}
            <div>
              <p className="font-semibold text-[#DABFFF] mb-4 text-lg">Scopri</p>
              <div className="flex flex-col space-y-3">
                <NavLink to="/venue/cocktail-lab" className="text-[#DABFFF]/80 hover:text-[#A06CD5] transition-colors hover:underline">
                  Monkey Cocktail Lab
                </NavLink>
                <NavLink to="/venue/factory" className="text-[#DABFFF]/80 hover:text-[#A06CD5] transition-colors hover:underline">
                  Monkey Factory
                </NavLink>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <p className="font-semibold text-[#DABFFF] mb-4 text-lg">Privacy</p>
              <div className="flex flex-col space-y-3">
                <NavLink to="/privacy" className="text-[#DABFFF]/80 hover:text-[#A06CD5] transition-colors hover:underline">
                  Informativa Privacy
                </NavLink>
                <NavLink to="/cookie" className="text-[#DABFFF]/80 hover:text-[#A06CD5] transition-colors hover:underline">
                  Cookie Policy
                </NavLink>
                <NavLink to="/termini" className="text-[#DABFFF]/80 hover:text-[#A06CD5] transition-colors hover:underline">
                  Termini di Servizio
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-[#A06CD5]/30" />

        <p className="text-center text-[#DABFFF]/70 text-sm">
          © {currentYear} Monkey Family. Tutti i diritti riservati.
          <button
            onClick={() => {
              localStorage.removeItem("monkey_cookie_consent");
              window.location.reload();
            }}
            className="text-[#DABFFF]/40 hover:text-[#DABFFF] text-xs transition-colors mx-2"
          >
            Gestisci cookie
          </button>
        </p>
      </div>
    </footer>
  );
};
export default Footer;

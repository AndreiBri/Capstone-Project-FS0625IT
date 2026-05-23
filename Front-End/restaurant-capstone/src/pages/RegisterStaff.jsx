import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, fetchAllVenues } from "../features/helper/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

const RegisterStaff = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllVenues()
      .then((data) => {
        setVenues(data);
        if (data.length > 0) setSelectedVenue(data[0].slug);
      })
      .catch(() => setErrorMsg("Impossibile caricare le venues."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const alias = e.target.alias.value.trim();

    try {
      await registerUser(email, password, "SUPERVISOR", selectedVenue, token, alias);
      setSuccessMsg("Supervisore registrato con successo!");
      e.target.reset();
      setSelectedVenue(venues[0]?.slug ?? "");
    } catch {
      setErrorMsg("Registrazione fallita: controlla i dati inseriti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#1C0127] to-[#320842]">
      <form onSubmit={handleSubmit} className="bg-[#1C0127]/80 backdrop-blur-lg p-10 rounded-2xl w-full max-w-md border border-[#DABFFF]/20 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="text-[#DABFFF]/50 hover:text-[#DABFFF] text-sm mb-6 flex items-center gap-1 transition"
        >
          Torna al pannello
        </button>

        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Registra Staff</h1>
        <p className="text-[#DABFFF]/40 text-sm mb-8">Il nuovo account avrà ruolo Supervisore</p>

        {successMsg && <div className="mb-4 p-4 bg-emerald-600/80 text-white rounded-lg text-center font-medium">{successMsg}</div>}
        {errorMsg && <div className="mb-4 p-4 bg-red-600/80 text-white rounded-lg text-center font-medium">{errorMsg}</div>}

        {/* Email Input */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
          required
        />

        {/* Alias Input */}
        <input
          name="alias"
          type="text"
          placeholder="Alias (nome visualizzato)"
          className="w-full p-4 mb-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
        />

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#DABFFF]/50 hover:text-[#DABFFF]"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Venue Selector */}
        <select
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
          className="w-full p-4 mb-6 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
          required
        >
          {venues.map((v) => (
            <option key={v.slug} value={v.slug}>
              {v.name}
            </option>
          ))}
        </select>

        {/* Submite Form Registration */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#A06CD5] text-white py-4 rounded-lg font-bold hover:bg-[#8a5bc0] transition shadow-lg shadow-[#A06CD5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registrazione..." : "Registra Supervisore"}
        </button>
      </form>
    </div>
  );
};

export default RegisterStaff;

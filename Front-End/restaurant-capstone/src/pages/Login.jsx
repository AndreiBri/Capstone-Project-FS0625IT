import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/helper/api";
import { useDispatch } from "react-redux";
import { setToken, setProfile } from "../features/auth/authSlice";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const data = await loginUser(email, password);
      dispatch(setToken(data.token));
      dispatch(setProfile({ profileId: data.profileId, email: data.email, role: data.role, venueId: data.venueId, venueName: data.venueName, alias: data.alias }));
      navigate("/");
    } catch (err) {
      setErrorMsg("Login fallito: controlla email o password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#1C0127] to-[#320842]">
      <form onSubmit={handleSubmit} className="bg-[#1C0127]/80 backdrop-blur-lg p-10 rounded-2xl w-full max-w-md border border-[#DABFFF]/20 shadow-2xl">
        <h1 className="text-4xl font-black text-white mb-8 text-center tracking-tight">Login Admin</h1>

        {errorMsg && <div className="mb-4 p-4 bg-red-600 text-white rounded-lg text-center font-medium">{errorMsg}</div>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-6 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#A06CD5] text-white py-4 rounded-lg font-bold hover:bg-[#8a5bc0] transition shadow-lg shadow-[#A06CD5]/30 mt-4"
        >
          Accedi
        </button>
      </form>
    </div>
  );
};

export default Login;

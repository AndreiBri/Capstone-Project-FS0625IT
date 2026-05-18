import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/helper/api";
import { useDispatch } from "react-redux";
import { setToken, setProfile } from "../features/auth/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      dispatch(
        setProfile({ profileId: data.profileId, email: data.email, role: data.role, venueId: data.venueId, venueName: data.venueName, alias: data.alias }),
      );
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

        <div className="relative mb-6">
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

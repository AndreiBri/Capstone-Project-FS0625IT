import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, profile, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A06CD5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#DABFFF]/50 text-sm">Verifica accesso...</p>
        </div>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

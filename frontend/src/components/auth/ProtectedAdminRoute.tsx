import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);

  // Wait for user data to be loaded
  if (!isAdmin && !user) {
    return null; // or a loading spinner
  }

  // Stay on current page if admin
  if (isAdmin) {
    return <>{children}</>;
  }

  // If not admin, go to home page
  return <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;

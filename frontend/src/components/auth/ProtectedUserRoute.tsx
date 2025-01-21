import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);

  // Wait for user data to be loaded
  if (!isAuthenticated && !user) {
    return null; // or a loading spinner
  }

  // Stay on current page if authenticated
  if (isAuthenticated && !isAdmin) {
    return <>{children}</>;
  }

  // If not authenticated, go to home page
  return <Navigate to="/" replace />;
};

export default ProtectedUserRoute;

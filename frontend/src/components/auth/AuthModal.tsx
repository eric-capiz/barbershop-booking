import { useState, useEffect } from "react";
import { useLogin, useRegister } from "@/hooks/useAuth";
import Toast from "../common/Toast";
import "./_auth-modal.scss";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, initialView }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(initialView === "login");

  useEffect(() => {
    setIsLogin(initialView === "login");
  }, [initialView]);

  const login = useLogin();
  const register = useRegister();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const initialFormData = {
    username: "",
    password: "",
    email: "",
    name: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setToast(null);
    }
  }, [isOpen]);

  // Update isLogin when initialView changes
  useEffect(() => {
    setIsLogin(initialView === "login");
  }, [initialView]);

  const resetForm = () => {
    setFormData(initialFormData);
    setToast(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login.mutateAsync({
          username: formData.username,
          password: formData.password,
        });
        setToast({ message: "Successfully logged in!", type: "success" });
      } else {
        await register.mutateAsync(formData);
        setToast({ message: "Successfully registered!", type: "success" });
      }
      setTimeout(() => {
        onClose();
      }, 1500); // Close modal after success message
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "An error occurred",
        type: "error",
      });
    }
  };

  const isLoading = login.isPending || register.isPending;

  if (!isOpen) return null;

  return (
    <>
      <div className="auth-modal">
        <div className="auth-modal__content">
          <button className="auth-modal__close-button" onClick={handleClose}>
            &times;
          </button>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              autoComplete="off"
              disabled={isLoading}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              autoComplete="new-password"
              disabled={isLoading}
            />

            {!isLogin && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  autoComplete="off"
                  disabled={isLoading}
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  autoComplete="off"
                  disabled={isLoading}
                />
              </>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="auth-modal__toggle-button"
              onClick={toggleAuthMode}
              disabled={isLoading}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default AuthModal;

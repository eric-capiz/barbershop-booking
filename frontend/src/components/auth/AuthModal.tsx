import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./_auth-modal.scss";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, initialView }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(initialView === "login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await axios.post("/api/auth/login", credentials);
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await axios.post("/api/auth/register", userData);
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({
          username: formData.username,
          password: formData.password,
        });
      } else {
        await registerMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
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
              />
            </>
          )}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;

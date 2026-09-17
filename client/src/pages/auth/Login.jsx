import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { AuthContext } from "../../contexts/AuthContext";
import { ROLE } from "@ecommerce/shared/constants";
import PATHS from "../../constants/paths";

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginSuccess = useCallback(
    (loggedInUser) => {
      alert("Login successful");

      if (loggedInUser?.role === ROLE.ADMIN) {
        navigate(location.state?.from?.pathname || PATHS.ADMIN.DASHBOARD, {
          replace: true,
        });
      } else {
        navigate(location.state?.from?.pathname || PATHS.PUBLIC.HOME, {
          replace: true,
        });
      }
    },
    [navigate, location],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const loggedInUser = await login(formData);

      handleLoginSuccess(loggedInUser);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(
    async (credential) => {
      try {
        setLoading(true);

        const loggedInUser = await googleLogin(credential);

        handleLoginSuccess(loggedInUser);
      } catch (error) {
        alert(error.response?.data?.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    [googleLogin, handleLoginSuccess],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!window.google?.accounts?.id) {
        return;
      }

      clearInterval(interval);

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          handleGoogleLogin(response.credential);
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        },
      );
    }, 100);

    return () => clearInterval(interval);
  }, [handleGoogleLogin]);

  return (
    <div className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <LoginForm
        formData={formData}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <div className="flex flex-col items-center gap-4">
        <div
          id="google-button"
          className="w-full max-w-md border border-gray-400"
        />

        <Link
          to={PATHS.PUBLIC.FORGOT_PASSWORD}
          className="text-sm font-semibold underline "
        >
          Forgot password?
        </Link>

        <p className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link to={PATHS.PUBLIC.REGISTER} className="font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

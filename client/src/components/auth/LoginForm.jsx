import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../common/Button";
import { ROLE } from "@ecommerce/shared/constants";
import PATHS from "../../constants/paths";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const loggedInUser = await login(formData);
      console.log(loggedInUser);
      console.log(loggedInUser?.role);
      console.log(ROLE.ADMIN);
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
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md w-full max-w-md"
    >
      <div className="flex flex-col gap-2">
        <label>Username, email, or phone number</label>

        <input
          type="text"
          name="identifier"
          placeholder="Enter your username, email, or phone number"
          value={formData.identifier}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Password</label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <Button
        variant="primary"
        type="submit"
        loading={loading}
        disabled={!formData.identifier || !formData.password}
      >
        Login
      </Button>

      <p className="text-sm text-center">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold underline">
          Register
        </Link>
      </p>
    </form>
  );
}

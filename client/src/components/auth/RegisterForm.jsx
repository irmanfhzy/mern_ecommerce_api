import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../common/Button";
import VerifyEmailForm from "./VerifyEmailForm";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [verificationEmail, setVerificationEmail] = useState(
    sessionStorage.getItem("verificationEmail") || "",
  );

  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);

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

      await register(formData);

      const resendCooldown = Date.now() + 60 * 1000;

      localStorage.setItem(
        `resendCooldown:${formData.email}`,
        resendCooldown.toString(),
      );

      sessionStorage.setItem("verificationEmail", formData.email);
      setVerificationEmail(formData.email);
    } catch (error) {
      if (error.response?.status === 429) {
        sessionStorage.setItem("verificationEmail", formData.email);
        setVerificationEmail(formData.email);
        alert(
          error.response?.data?.message ||
            "Please wait for the cooldown to finish before requesting another code.",
        );
        return;
      }
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (verificationEmail) {
    return (
      <VerifyEmailForm
        email={verificationEmail}
        onBack={() => {
          sessionStorage.removeItem("verificationEmail");
          setVerificationEmail("");
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md w-full max-w-md"
    >
      <div className="flex flex-col gap-2">
        <label>Name</label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Email</label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Password</label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Confirm Password</label>

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Enter your password again"
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <Button variant="primary" type="submit" loading={loading}>
        Register
      </Button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold underline">
          Login
        </Link>
      </p>
    </form>
  );
}

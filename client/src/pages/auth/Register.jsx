import { useState } from "react";
import { Link } from "react-router-dom";

import RegisterForm from "../../components/auth/RegisterForm";
import VerifyEmailForm from "../../components/auth/VerifyEmailForm";

import { register } from "../../services/auth.service";

export default function Register() {
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

      const res = await register(formData);

      const cooldown = res.data.cooldown;
      const cooldownEnd = Date.now() + cooldown;

      localStorage.setItem(
        `resendCooldown:${formData.email}`,
        cooldownEnd.toString(),
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

  const handleBack = () => {
    sessionStorage.removeItem("verificationEmail");
    setVerificationEmail("");
  };

  if (verificationEmail) {
    return (
      <div className="flex flex-col gap-4 bg-white p-4 md:p-8 rounded-xl shadow-md w-full max-w-lg">
        <VerifyEmailForm email={verificationEmail} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
      <RegisterForm
        formData={formData}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold underline">
          Login
        </Link>
      </p>
    </div>
  );
}

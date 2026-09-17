import { useEffect, useState } from "react";

import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import VerifyResetPasswordForm from "../../components/auth/VerifyResetPasswordForm";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

import {
  forgotPassword,
  verifyResetPassword,
  resetPassword,
  resendPasswordReset,
} from "../../services/auth.service";

export default function ForgotPassword() {
  const [step, setStep] = useState(
    Number(sessionStorage.getItem("forgotPasswordStep")) || 1,
  );

  const [email, setEmail] = useState(
    sessionStorage.getItem("verificationEmail") || "",
  );

  const [otp, setOtp] = useState("");

  const [countdown, setCountdown] = useState(0);

  const [cooldownEnd, setCooldownEnd] = useState(() => {
    const savedEmail = sessionStorage.getItem("verificationEmail");

    if (!savedEmail) return 0;

    return Number(localStorage.getItem(`resendCooldown:${savedEmail}`)) || 0;
  });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const resendCooldownKey = `resendCooldown:${email}`;
  const tokenResetKey = `tokenResetKey:${email}`;

  useEffect(() => {
    if (!cooldownEnd) {
      setCountdown(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remaining <= 0) {
        localStorage.removeItem(resendCooldownKey);
        setCooldownEnd(0);
        setCountdown(0);
        return;
      }

      setCountdown(remaining);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [cooldownEnd, resendCooldownKey]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await forgotPassword(email);

      const cooldownEnd = Date.now() + res.data.cooldown;

      localStorage.setItem(`resendCooldown:${email}`, cooldownEnd.toString());

      setCooldownEnd(cooldownEnd);

      sessionStorage.setItem("verificationEmail", email);
      sessionStorage.setItem("forgotPasswordStep", "2");

      setStep(2);
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to send password reset code",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await verifyResetPassword({
        email,
        otp,
      });

      sessionStorage.setItem(tokenResetKey, res.data.resetPasswordToken);

      sessionStorage.setItem("forgotPasswordStep", "3");

      setStep(3);
    } catch (error) {
      alert(
        error.response?.data?.message || "Invalid or expired verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await resetPassword({
        token: sessionStorage.getItem(tokenResetKey),
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });

      sessionStorage.removeItem("verificationEmail");
      sessionStorage.removeItem("forgotPasswordStep");
      sessionStorage.removeItem(tokenResetKey);
      localStorage.removeItem(resendCooldownKey);

      setStep(1);
      setEmail("");
      setOtp("");
      setCooldownEnd(0);
      setCountdown(0);

      setFormData({
        newPassword: "",
        confirmNewPassword: "",
      });

      alert("Password reset successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem("verificationEmail");
    sessionStorage.removeItem("forgotPasswordStep");

    setStep(1);
    setEmail("");
    setOtp("");
    setCooldownEnd(0);
    setCountdown(0);
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);

      const res = await resendPasswordReset(email);

      const cooldownEnd = Date.now() + res.data.cooldown;

      localStorage.setItem(resendCooldownKey, cooldownEnd.toString());

      setCooldownEnd(cooldownEnd);
      setOtp("");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to resend verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      {step === 1 && (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Forgot Password?</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email address and we'll send you a verification code to
              reset your password.
            </p>
          </div>

          <ForgotPasswordForm
            email={email}
            loading={loading}
            onChange={handleEmailChange}
            onSubmit={handleForgotPassword}
          />
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col gap-4 mb-6 text-center">
            <h1 className="text-2xl font-bold">Verify Reset Password</h1>

            <div className="flex flex-col items-center text-sm">
              <p>Enter the verification code sent to</p>
              <p className="font-bold">{email}</p>
            </div>
          </div>

          <VerifyResetPasswordForm
            otp={otp}
            loading={loading}
            onChange={handleOtpChange}
            onSubmit={handleVerifyResetPassword}
            onBack={handleBack}
            onResendCode={handleResendCode}
            countdown={countdown}
          />
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex flex-col gap-4 mb-6 text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your new password.
            </p>
          </div>

          <ResetPasswordForm
            formData={formData}
            loading={loading}
            onChange={handlePasswordChange}
            onSubmit={handleResetPassword}
          />
        </>
      )}
    </div>
  );
}

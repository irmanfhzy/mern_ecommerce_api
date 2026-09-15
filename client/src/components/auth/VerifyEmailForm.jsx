import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../common/Button";

export default function VerifyEmailForm({ email, onBack }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { verifyEmail, resendVerificationEmail } = useContext(AuthContext);

  const navigate = useNavigate();

  const resendCooldownKey = `resendCooldown:${email}`;

  useEffect(() => {
    const resendCooldown = Number(localStorage.getItem(resendCooldownKey));

    if (!resendCooldown) return;

    const updateCountdown = () => {
      const remaining = Math.ceil((resendCooldown - Date.now()) / 1000);

      if (remaining <= 0) {
        localStorage.removeItem(resendCooldownKey);
        setCountdown(0);
        return;
      }

      setCountdown(remaining);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [resendCooldownKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await verifyEmail({
        email,
        otp,
      });

      sessionStorage.removeItem("verificationEmail");
      localStorage.removeItem(resendCooldownKey);

      alert("Email verified successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      await resendVerificationEmail(email);

      const resendCooldown = Date.now() + 60 * 1000;

      localStorage.setItem(resendCooldownKey, resendCooldown.toString());

      setCountdown(60);
      setOtp("");

      alert("Verification code resent to your email");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to resend verification code",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md w-full max-w-md"
    >
      <h2 className="text-xl font-semibold">Verify your email</h2>

      <p className="text-sm">
        Enter the verification code sent to <strong>{email}</strong>.
      </p>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter verification code"
        className="border rounded-lg px-4 py-2"
      />

      <Button variant="primary" type="submit" loading={loading}>
        Verify Email
      </Button>

      <div className="flex flex-col gap-4 text-center text-sm">
        {countdown > 0 ? (
          <p>Resend code in {countdown}s</p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold underline cursor-pointer"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="font-semibold underline cursor-pointer"
        >
          Back to Register
        </button>
      </div>
    </form>
  );
}

import Button from "../common/Button";

export default function VerifyResetPasswordForm({
  otp,
  loading,
  onChange,
  onSubmit,
  onBack,
  onResendCode,
  countdown,
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="otp" className="font-medium">
          Verification Code
        </label>

        <input
          id="otp"
          type="text"
          name="otp"
          value={otp}
          onChange={onChange}
          placeholder="Enter verification code"
          required
          maxLength="6"
          className="border rounded-lg px-4 py-2.5 outline-none focus:ring-2"
        />
      </div>

      <Button variant="primary" type="submit" loading={loading} disabled={!otp}>
        Verify Code
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold underline"
      >
        Back
      </button>
      <div className="flex flex-col gap-4 text-center text-sm">
        {countdown > 0 ? (
          <p>Resend code is {countdown}s</p>
        ) : (
          <button
            type="button"
            onClick={onResendCode}
            disabled={loading}
            className="font-semibold underline cursor-pointer"
          >
            {loading ? "Sending..." : "Resend Code"}
          </button>
        )}
      </div>
    </form>
  );
}

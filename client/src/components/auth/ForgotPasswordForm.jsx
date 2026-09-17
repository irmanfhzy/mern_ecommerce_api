import { Link } from "react-router-dom";

import Button from "../common/Button";

export default function ForgotPasswordForm({
  email,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={onChange}
          required
          className="border rounded-lg px-4 py-2.5 outline-none focus:ring-2"
        />
      </div>

      <Button
        variant="primary"
        type="submit"
        loading={loading}
        disabled={!email}
      >
        Send Code
      </Button>

      <p className="text-sm text-center text-gray-500">
        Remember your password?{" "}
        <Link to="/login" className="font-semibold underline text-gray-900">
          Login
        </Link>
      </p>
    </form>
  );
}

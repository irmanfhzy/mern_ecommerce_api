import Button from "../common/Button";
import PasswordField from "./PasswordField";

export default function ResetPasswordForm({
  formData,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-medium">
          New Password
        </label>

        <PasswordField
          id="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={onChange}
          placeholder="Enter your new password"
          required
          fieldClassName="border rounded-lg px-4 py-2.5 outline-none focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="font-medium">
          Confirm Password
        </label>

        <PasswordField
          id="confirmPassword"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={onChange}
          placeholder="Enter your new password again"
          required
          fieldClassName="border rounded-lg px-4 py-2.5 outline-none focus:ring-2"
        />
      </div>

      <Button
        variant="primary"
        type="submit"
        loading={loading}
        disabled={!formData.newPassword || !formData.confirmNewPassword}
      >
        Reset Password
      </Button>
    </form>
  );
}

import Button from "../common/Button";
import PasswordField from "./PasswordField";

export default function RegisterForm({
  formData,
  loading,
  onChange,
  onSubmit,
}) {
  const disabledSubmit =
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Enter your name"
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Enter your email"
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>

        <PasswordField
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Enter your password"
          fieldClassName="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword">Confirm Password</label>

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          placeholder="Enter your password again"
          fieldClassName="border rounded-lg px-4 py-2"
        />
      </div>

      <Button
        variant="primary"
        type="submit"
        loading={loading}
        disabled={disabledSubmit}
      >
        Register
      </Button>
    </form>
  );
}

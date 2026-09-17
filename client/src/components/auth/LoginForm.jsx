import Button from "../common/Button";
import PasswordField from "./PasswordField";

export default function LoginForm({ formData, loading, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="identifier">Username, email, or phone number</label>

        <input
          id="identifier"
          type="text"
          name="identifier"
          placeholder="Enter your username, email, or phone number"
          value={formData.identifier}
          onChange={onChange}
          required
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>

        <PasswordField
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={onChange}
          required
          fieldClassName="border rounded-lg px-4 py-2 pr-12"
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
    </form>
  );
}

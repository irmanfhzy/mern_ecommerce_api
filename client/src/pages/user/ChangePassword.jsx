import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountForm from "../../components/user/AccountForm";

import { changePassword } from "../../services/user.service";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmNewPassword) {
      return alert("Password confirmation does not match.");
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });

      alert("Password updated successfully.");

      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountForm
      title="Change Password"
      description="Update your account password."
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Current Password
        </label>

        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">New Password</label>

        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Confirm New Password
        </label>

        <input
          type="password"
          name="confirmNewPassword"
          value={form.confirmNewPassword}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>
    </AccountForm>
  );
}

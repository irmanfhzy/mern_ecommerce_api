import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

import Button from "../../components/common/Button";

import { getProfile, updateProfile } from "../../services/user.service";

import { GENDER } from "@ecommerce/shared/constants";

export default function EditProfile() {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        const profile = res.data.data;

        setForm({
          name: profile.name || "",
          gender: profile.gender || "",
          dateOfBirth: profile.dateOfBirth?.slice(0, 10) || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateProfile(form);

      setUser(res.data.data);

      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Profile</h1>

        <p className="mt-2 text-gray-500">Update your personal information.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="gender" className="mb-2 block text-sm font-medium">
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>

              <option value={GENDER.MALE}>Male</option>

              <option value={GENDER.FEMALE}>Female</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-2 block text-sm font-medium"
            >
              Date of Birth
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t pt-6">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>

          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

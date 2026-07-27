import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/common/Loading";
import AccountForm from "../../components/user/AccountForm";

import { AuthContext } from "../../contexts/AuthContext";

import { updatePhone } from "../../services/user.service";

export default function EditEmail() {
  const navigate = useNavigate();

  const { user, getMe } = useContext(AuthContext);

  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updatePhone({
        phone,
      });

      await getMe();

      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <Loading fullScreen />;
  }

  return (
    <AccountForm
      title="Edit Phone Number"
      description="Update your phone number."
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>

        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>
    </AccountForm>
  );
}

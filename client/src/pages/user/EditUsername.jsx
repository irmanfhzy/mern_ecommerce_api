import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/common/Loading";
import AccountForm from "../../components/user/AccountForm";

import { AuthContext } from "../../contexts/AuthContext";

import { updateUsername } from "../../services/user.service";

export default function EditUsername() {
  const navigate = useNavigate();

  const { user, getMe } = useContext(AuthContext);

  const [username, setUsername] = useState(user.username);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateUsername({
        username,
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
      title="Edit Username"
      description="Update your username."
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Username</label>

        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>
    </AccountForm>
  );
}

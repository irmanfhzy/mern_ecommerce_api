import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";

import { AuthContext } from "../../contexts/AuthContext";

export default function Account() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const items = [
    {
      label: "Email",
      value: user?.email,
      button: "Edit",
      path: "email/edit",
    },
    {
      label: "Username",
      value: user?.username,
      button: "Edit",
      path: "username/edit",
    },
    {
      label: "Phone",
      value: user?.phone,
      button: "Edit",
      path: "phone/edit",
    },
    {
      label: "Password",
      value: "••••••••••••",
      button: "Change",
      path: "password/change",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account</h1>

        <p className="mt-2 text-gray-500">
          Manage your account information and security.
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>

              <p className="mt-1 text-lg font-medium">{item.value}</p>
            </div>

            <Button variant="primary" onClick={() => navigate(item.path)}>
              {item.button}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

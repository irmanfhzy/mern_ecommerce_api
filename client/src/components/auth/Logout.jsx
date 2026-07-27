import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";
import { LogOut } from "lucide-react";

export default function Logout({ className = "", onClick, icon }) {
  const { logout } = useContext(AuthContext);
  const { openDialog, updateDialog, closeDialog } = useContext(
    ConfirmationDialogContext,
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
    onClick?.();

    openDialog({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmVariant: "primary",
      confirmText: "Logout",
      cancelText: "Cancel",
      onConfirm: handleLogout,
    });
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      updateDialog({ message: "Logging out..." });
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  return (
    <button
      onClick={confirmLogout}
      disabled={loading}
      className={`flex items-center gap-2 cursor-pointer ${className}`}
    >
      {icon && <LogOut className="w-5 h-5" />}
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

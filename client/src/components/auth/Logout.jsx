import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";
import Button from "../common/Button";

export default function Logout({ className = "" }) {
  const { logout } = useContext(AuthContext);
  const { openDialog, updateDialog, closeDialog } = useContext(
    ConfirmationDialogContext,
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
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
    <Button
      variant="ghost"
      onClick={confirmLogout}
      disabled={loading}
      className={className}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}

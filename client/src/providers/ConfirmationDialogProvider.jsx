import { useState } from "react";
import { ConfirmationDialogContext } from "../contexts/ConfirmationDialogContext";
import ConfirmationDialog from "../components/common/ConfirmationDialog";

export default function ConfirmationDialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmVariant: "primary",
    cancelVariant: "ghost",
    confirmText: "Yes",
    cancelText: "No",
    onConfirm: null,
    loading: false,
    disabled: false,
  });

  const openDialog = ({
    title,
    message,
    confirmVariant = "primary",
    cancelVariant = "ghost",
    confirmText = "Yes",
    cancelText = "No",
    onConfirm,
    disabled = false,
    loading = false,
  }) => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmVariant,
      cancelVariant,
      confirmText,
      cancelText,
      onConfirm,
      disabled,
      loading,
    });
  };

  const updateDialog = (data) => {
    setDialog((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const closeDialog = () => {
    setDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <ConfirmationDialogContext.Provider
      value={{
        openDialog,
        updateDialog,
        closeDialog,
      }}
    >
      {children}

      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        confirmVariant={dialog.confirmVariant}
        cancelVariant={dialog.cancelVariant}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
        disabled={dialog.disabled}
        loading={dialog.loading}
      />
    </ConfirmationDialogContext.Provider>
  );
}

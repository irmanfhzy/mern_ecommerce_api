import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmVariant = "danger",
  cancelVariant = "secondary",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-gray-600">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant={cancelVariant} onClick={onCancel}>
          {cancelText}
        </Button>

        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

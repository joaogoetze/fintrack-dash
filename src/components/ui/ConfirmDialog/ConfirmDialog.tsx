import DynamicModal from "../DynamicModal/DynamicModal";
import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = true,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <DynamicModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-dialog">
        <p className="confirm-dialog-message">{message}</p>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button
            type="button"
            className={danger ? "btn-danger" : "btn-save"}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </DynamicModal>
  );
}

export default ConfirmDialog;
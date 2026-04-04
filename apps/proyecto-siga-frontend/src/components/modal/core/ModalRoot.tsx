import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import { useModal } from "../../../hooks/useModal";

export default function ModalRoot() {
  const { activeModal, closeModal } = useModal();

  if (!activeModal.type) return null;

  switch (activeModal.type) {
    case "register":
      return (
        <RegisterModal
          isOpen
          onClose={closeModal}
          isAdminMode={activeModal.payload?.isAdminMode}
          onSuccess={activeModal.payload?.onSuccess}
        />
      );
    case "login":
      return <LoginModal isOpen onClose={closeModal} />;
    case "changePassword":
      return <ChangePasswordModal isOpen onClose={closeModal} />;
    default:
      return null;
  }
}

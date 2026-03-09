import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  ActiveModalState,
  ModalContext,
  ModalContextType,
  ModalType,
} from "../context/modalContext";

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModalState>({ type: null });

  const openModal = useCallback<ModalContextType["openModal"]>(
    (type, payload) => {
      setActiveModal({
        type,
        payload: payload as ActiveModalState["payload"],
      } as ActiveModalState);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setActiveModal({ type: null });
  }, []);

  const isModalOpen = useCallback(
    (type: ModalType) => activeModal.type === type,
    [activeModal.type],
  );

  const value = useMemo(
    () => ({
      activeModal,
      openModal,
      closeModal,
      isModalOpen,
    }),
    [activeModal, openModal, closeModal, isModalOpen],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

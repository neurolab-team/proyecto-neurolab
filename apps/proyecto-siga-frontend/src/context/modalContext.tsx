import { createContext } from "react";

export type ModalType = "register" | "login" | "changePassword" | "usabilitySurvey";

export type RegisterModalOptions = {
  isAdminMode?: boolean;
  onSuccess?: () => void;
};

type ModalPayloadMap = {
  register: RegisterModalOptions | undefined;
  login: undefined;
  changePassword: undefined;
  usabilitySurvey: undefined;
};

export type ActiveModalState =
  | { type: null; payload?: undefined }
  | { type: "register"; payload?: RegisterModalOptions }
  | { type: "login"; payload?: undefined }
  | { type: "changePassword"; payload?: undefined }
  | { type: "usabilitySurvey"; payload?: undefined };

export type ModalContextType = {
  activeModal: ActiveModalState;
  openModal: <T extends ModalType>(type: T, payload?: ModalPayloadMap[T]) => void;
  closeModal: () => void;
  isModalOpen: (type: ModalType) => boolean;
};

export const ModalContext = createContext<ModalContextType | null>(null);

"use client";
import GenericModal from "@/components/elements/GenericModal";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
} from "react";

export interface GenericModalContextProps {
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "2xl";
  variant?: "default" | "centered" | "top";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  content?: ReactElement | ReactElement[] | ReactNode | ReactNode[];
}

type ModalContextType = {
  openModal: (props: GenericModalContextProps) => void;
  closeModal: () => void;
  isOpen: boolean;
};

export const GenericModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const useGenericModal = () => {
  const ctx = useContext(GenericModalContext);
  if (!ctx)
    throw new Error("useGenericModal must be used within GenericModalProvider");
  return ctx;
};

export const GenericModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalProps, setModalProps] = useState<GenericModalContextProps | null>(
    null
  );

  const closeModal = () => setModalProps(null);
  const openModal = (props: GenericModalContextProps) => setModalProps(props);

  return (
    <GenericModalContext.Provider
      value={{ openModal, closeModal, isOpen: !!modalProps }}
    >
      {children}
      <GenericModal
        isOpen={!!modalProps}
        onClose={closeModal}
        title={modalProps?.title}
        size={modalProps?.size}
        bodyClassName={modalProps?.bodyClassName}
      >
        {modalProps?.content ?? null}
      </GenericModal>
    </GenericModalContext.Provider>
  );
};

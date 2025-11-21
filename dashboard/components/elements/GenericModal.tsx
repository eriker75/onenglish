import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";

export interface GenericModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "2xl";
  variant?: "default" | "centered" | "top";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  useBlur?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  content?: ReactElement | ReactElement[] | ReactNode | ReactNode[];
}

const GenericModal: React.FC<GenericModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  size = "md",
  variant = "centered",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  useBlur = false,
  className = "",
  headerClassName = "",
  bodyClassName = "",
}) => {
  // Handle escape key press
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full mx-4",
  };

  // Variant configurations
  const variantClasses = {
    default: "items-center",
    centered: "items-center",
    top: "items-start pt-16",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/30 ${useBlur ? 'backdrop-blur-sm' : ''} flex justify-center z-50 p-4 transition-opacity duration-300 ${variantClasses[variant]}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-[#1E1E1E] rounded-lg shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 shrink-0 ${headerClassName}`}
          >
            {title && (
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Cerrar modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={`flex-1 overflow-y-auto custom-scrollbar-vertical min-h-0 ${bodyClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;

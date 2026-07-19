import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Focus the modal container
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2926]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal dialog box */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative bg-white rounded-xl shadow-lg border border-[#E6E2DE] w-full max-w-lg overflow-hidden flex flex-col focus:outline-none max-h-[90vh]",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2DE]">
          <h3 id="modal-title" className="text-sm font-bold uppercase tracking-wider text-[#7A7169]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A69F98] hover:text-[#4A443F] hover:bg-[#F1EFEC] transition-colors focus:ring-2 focus:ring-[#5A5A40] focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

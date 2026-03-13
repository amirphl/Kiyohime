import React from 'react';
import { X } from 'lucide-react';

interface ModalShellProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  title,
  onClose,
  children,
  maxWidthClassName = 'max-w-5xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full ${maxWidthClassName} bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 max-h-[75vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalShell;

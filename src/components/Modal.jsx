import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      <div className="bg-[#FDFCF0] rounded-xl shadow-2xl w-full max-w-md border border-[#F5E6CC] overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-5 border-b border-[#F5E6CC] bg-white">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-orange-100 text-gray-500 hover:text-[#FF8C00] transition-colors"
          >
            <X size={22} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
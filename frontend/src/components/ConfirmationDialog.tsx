import React from "react";

interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed text-center text-xs top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl px-5 py-5 shadow-md flex flex-col gap-4 md:w-1/6 w-4/6">
      <div className="font-semibold text-center text-sm">{title}</div>
        <p className="text-sm">{message}</p>
        <div className="flex gap-3 mb-2">
          <button
            className="font-bold border text-my-blue border-my-blue rounded-md py-2 flex-1"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="font-bold bg-my-blue text-white rounded-md hover:bg-blue-500 flex-1"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

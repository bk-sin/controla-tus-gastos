"use client";

export const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  if (!message) return null;

  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 right-4 ${backgroundColor} text-white p-4 rounded shadow-lg z-50`}
    >
      {message}
      <button onClick={onClose} className="ml-4">
        ✕
      </button>
    </div>
  );
};

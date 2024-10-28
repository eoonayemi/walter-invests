import { useEffect } from "react";
import { IconContext } from "react-icons";
import { TiTimes } from "react-icons/ti";

type ToastMessage = {
  type: "SUCCESS" | "ERROR";
  message: string;
  onClose: () => void;
};
const Toast = ({ type, message, onClose }: ToastMessage) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const styles =
    type == "SUCCESS"
      ? "fixed bottom-0 right-0 left-0 py-3 px-5 bg-green-600 opacity-50 text-white"
      : "fixed bottom-0 right-0 left-0 py-3 px-5 bg-red-600 opacity-50 text-white";
  return (
    <div
      className={`text-xm font-semibold z-50 ${styles} md:bottom-5 md:right-5 md:left-auto`}
    >
      <div className="flex justify-center md:justify-between gap-5 items-center">
        <span className="text-sm">{message}</span>
        <span className="hidden md:block">
          <IconContext.Provider value={{ className: "font-bold text-lg text-black" }}>
            <TiTimes />
          </IconContext.Provider>
        </span>
      </div>
    </div>
  );
};

export default Toast;

type ButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
};
export const Button = ({
  text,
  onClick,
  disabled,
  type,
  className,
}: ButtonProps) => {
  return (
    <button
      type={type || "button"}
      className={`${className} px-4 py-2 text-xs font-semibold rounded-lg w-[4rem] md:w-[5rem] flex justify-center items-center`}
      onClick={onClick}
      disabled={disabled === undefined ? false : disabled}
    >
      {text}
    </button>
  );
};

import { FormEvent, useState } from "react";

type ResetPasswordFormProps = {
  resetPassword: (password: string) => void;
  buttonTag: string;
  title: string;
};

const ResetPasswordForm = ({
  resetPassword,
  buttonTag,
  title,
}: ResetPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword) {
      return setPasswordErr("Password is required");
    }
    if (!confirmPassword) {
      return setPasswordErr("Confirm password is required");
    }
    if (newPassword.length < 8) {
      return setPasswordErr("Password must be at least 8 characters");
    }
    if (newPassword !== confirmPassword) {
      return setPasswordErr("Password doesn't match");
    }
    resetPassword(newPassword);
  };
  return (
    <div className="bg-white flex flex-col shadow-my-shadow rounded-lg overflow-hidden flex-1 self-center">
      <div className="bg-my-blue text-white text-center py-4 font-semibold">
        <h2>{title}</h2>
      </div>
      <div>
        <form className="flex flex-col gap-4 text-sm px-8 py-8" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">New Password</label>
            <input
              placeholder="New Password"
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordErr("");
              }}
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Confirm Password</label>
            <input
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordErr("");
              }}
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
            />
          </div>

          {passwordErr && (
            <span className="bg-red-500 bg-opacity-20 text-red-500 font-semibold text-center rounded-md p-2 text-sm">
              {passwordErr}
            </span>
          )}

          <button
            type="submit"
            className="font-semibold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500"
          >
            {buttonTag}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

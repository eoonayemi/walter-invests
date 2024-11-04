import { useState } from "react";
import { Link } from "react-router-dom";

type PopUpProps = {
  TGLink: string;
};

const PopUp = ({ TGLink }: PopUpProps) => {
  const [showPopUp, setShowPopUp] = useState(true);

  const togglePopUp = () => {
    setShowPopUp((prev) => !prev);
  };
  return (
    <div
      className={`flex bg-black bg-opacity-70 h-screen inset-0 justify-center items-center z-50 fixed left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] ${
        showPopUp ? "block" : "hidden"
      }`}
    >
      <div className="flex flex-col rounded-3xl overflow-hidden w-full mx-2">
        <div className="bg-my-blue flex justify-center items-center py-16">
          <img
            src="http://res.cloudinary.com/dc0tvk5bx/image/upload/v1717181268/nolgs5roa1oxnwqlcpaa.png"
            alt="logo"
            className=" w-56 text-white"
          />
        </div>
        <div className="bg-white p-7 flex flex-col text-sm text-slate-500">
          <h2 className="font-semibold text-lg text-black">
            Welcome to WalterInvests Platform
          </h2>
          <p>Welcome Bonus - N100</p>
          <p>Daily Check-In - N100</p>
          <p>Minimum Deposit - N2,000</p>
          <p>Minimum Withdrawal - N1,000</p>
          <p>Withdrawal Time - 24/7</p>
          <p>Referral Bonus - 30%</p>
          <p className="mt-2">
            WalterInvests users can make withdrawals daily without any
            limitation
          </p>
          <p className="font-semibold">
            Click the button below to join our official Telegram channel for
            more updates
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              to={TGLink}
              className="bg-my-blue active:bg-blue-800 text-white rounded-full text-sm p-4 flex-1 text-center"
            >
              Join Telegram
            </Link>
            <button
              onClick={togglePopUp}
              type="button"
              className="hover:bg-black hover:bg-opacity-10 border-[1.5px] border-my-blue rounded-full text-sm p-4 text-my-blue flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;

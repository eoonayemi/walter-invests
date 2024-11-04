import { IoIosArrowDropleft } from "react-icons/io";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IconContext } from "react-icons";
import TabBar from "../../components/TabBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import * as apiClient from "../../api-clients";
import { useQuery } from "react-query";
import NoTabLayout from "../../layouts/NoTabLayout";
import { PlanType } from "./Products";
import { Referral } from "../../redux/userSlice";

const Team = () => {
  const navigate = useNavigate();
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [referRates, setReferRates] = useState<number[]>([]);
  const { user } = useAppSelector((state) => state.user);
  const invitationLink = `https://walter-invests.onrender.com/register?inviteCode=${user?.inviteCode}`;
  const inviteCode = user?.inviteCode;

  const { data, isLoading } = useQuery(
    "getAllProducts",
    apiClient.getAllProducts
  );

  useEffect(() => {
    if (data) {
      let fR = 0;
      let sR = 0;
      let tR = 0;
      let total = 0;
      data.forEach((product: PlanType) => {
        const { firstRefer, secondRefer, thirdRefer } = product.commission;
        fR += firstRefer;
        sR += secondRefer;
        tR += thirdRefer;
        total++;
      });
      setReferRates([
        Math.floor(fR / total),
        Math.floor(sR / total),
        Math.floor(tR / total),
      ]);
    }
  }, [data]);

  const [fR, sR, tR] = referRates;
  const {
    firstRefer: fRefer,
    secondRefer: sRefer,
    thirdRefer: tRefer,
  } = user?.referral as Referral;

  const copyText = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      textToCopy == invitationLink ? setLinkCopied(true) : setCodeCopied(true);
      setTimeout(
        () =>
          textToCopy == invitationLink
            ? setLinkCopied(false)
            : setCodeCopied(false),
        2000
      );
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (isLoading)
    return <NoTabLayout title="Invite Friends" subtitle="Loading..." />;

  return (
    <div className="bg-gray-100 min-h-screen pt-[4.5rem] pb-32 flex flex-col gap-3">
      <div className="flex py-3 px-3 gap-1 items-center bg-white fixed top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] font-semibold">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(-1)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-semibold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>
        <span>Invite Friends</span>
      </div>

      <div className="flex flex-col rounded-xl px-2 py-2 bg-white mx-3 gap-2">
        <h1 className="font-semibold text-center">Invitation Code</h1>
        <span className="bg-blue-100 px-4 py-2 rounded-xl text-my-blue text-center">
          {inviteCode}
        </span>
        <button
          className={`bg-my-blue text-white px-4 py-2 rounded-xl ${
            codeCopied && "font-semibold"
          }`}
          onClick={() => copyText(inviteCode as string)}
        >
          {codeCopied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex flex-col rounded-xl px-2 py-2 bg-white mx-3 gap-2">
        <h1 className="font-semibold text-center">Invitation Link</h1>
        <span className="bg-blue-100 px-4 py-2 rounded-xl text-my-blue text-center">
          {invitationLink}
        </span>
        <button
          className={`bg-my-blue text-white px-4 py-2 rounded-xl ${
            linkCopied && "font-semibold"
          }`}
          onClick={() => copyText(invitationLink)}
        >
          {linkCopied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex flex-col mx-3 gap-2">
        <h1 className="font-semibold">My Team</h1>
        <div className="flex bg-white justify-between text-sm rounded-xl overflow-hidden text-gray-400">
          <div className="bg-my-blue text-white flex items-center justify-center px-5 font-semibold">
            LV1
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">{fR}%</span>
            <span>Commission rate</span>
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">
              {fRefer.members}
            </span>
            <span>Members</span>
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">
              N{fRefer.bonus}.00
            </span>
            <span>Bonus</span>
          </div>
        </div>
        <div className="flex bg-white justify-between text-sm rounded-xl overflow-hidden text-gray-400">
          <div className="bg-my-blue text-white flex items-center justify-center px-5 font-semibold">
            LV2
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">{sR}%</span>
            <span>Commission rate</span>
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">
              {sRefer.members}
            </span>
            <span>Members</span>
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">
              N{sRefer.bonus}.00
            </span>
            <span>Bonus</span>
          </div>
        </div>
        <div className="flex bg-white justify-between text-sm rounded-xl overflow-hidden text-gray-400">
          <div className="bg-my-blue text-white flex items-center justify-center px-5 font-semibold">
            LV3
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">{tR}%</span>
            <span>Commission rate</span>
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">
              {tRefer.members}
            </span>
            <span>Members</span>
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <span className="font-semibold text-xl text-my-blue">
              N{tRefer.bonus}.00
            </span>
            <span>Bonus</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mx-3 gap-3 font-semibold text-gray-400">
        <div className="bg-white flex flex-col justify-center items-center rounded-xl flex-1 h-32">
          <span className="text-3xl text-my-blue">
            {fRefer.members + sRefer.members + tRefer.members}
          </span>
          <span>Number of People</span>
        </div>
        <div className="bg-white flex flex-col justify-center items-center rounded-xl flex-1 h-32">
          <span className="text-3xl text-my-blue">
            N{fRefer.bonus + sRefer.bonus + tRefer.bonus}.00
          </span>
          <span>Total Revenue</span>
        </div>
      </div>

      <div className="bg-white mx-3 rounded-xl overflow-hidden">
        <h1 className="bg-my-blue text-center text-white py-4 font-semibold">
          Invitation Award
        </h1>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{ className: "font-semibold text-3xl text-my-blue" }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            When the friends you invite sign up and invest, you will get 25%
            cashback instantly
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{ className: "font-semibold text-2xl text-my-blue" }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            You'll get 5% cash back when your level 2 team members invest
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{ className: "font-semibold text-2xl text-my-blue" }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            You'll get 1% cash back when your level 3 team members invest
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-semibold text-[3rem] text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            Cash rewards will be sent to your account balance once your team
            members invest. You can withdraw it immediately.
          </span>
        </div>
      </div>

      <TabBar />
    </div>
  );
};

export default Team;

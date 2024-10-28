import { FaCircleUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import * as apiClient from ".././api-clients";
import { useAppContext } from "../contexts/AppContext";
import { useAppDispatch } from "../redux/hooks";
import {
  onLogOutError,
  onLogOutStart,
  onLogOutSuccess,
} from "../redux/adminSlice";

const AdminProfileMenu = ({
  setShowAdminProfile,
}: {
  setShowAdminProfile: () => void;
}) => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: logOut, isLoading } = useMutation(apiClient.logAdminOut, {
    onSuccess: async (data) => {
      dispatch(onLogOutSuccess());
      showToast({ type: "SUCCESS", message: data.message });
      navigate("/admin/login");
    },
    onError: (error: Error) => {
      dispatch(onLogOutError(error));
      showToast({ type: "ERROR", message: error.message });
    },
  });

  return (
    <div className="absolute flex flex-col text-slate-400 bg-gray-400 shadow-my-shadow top-8 w-52 right-0 rounded-lg overflow-hidden">
      <Link
        onClick={setShowAdminProfile}
        className="bg-white px-6 py-3 hover:bg-my-blue hover:text-white"
        to="/admin/profile"
      >
        <FaCircleUser className="mr-2 inline-block" />
        <span>Profile</span>
      </Link>
      <Link
        to="/admin/profile"
        onClick={setShowAdminProfile}
        className="bg-white px-6 py-3 hover:bg-my-blue hover:text-white"
      >
        <RiLockPasswordFill className="mr-2 inline-block" />
        <span>Change Password</span>
      </Link>
      <button
        onClick={() => {
          setShowAdminProfile();
          dispatch(onLogOutStart());
          logOut();
        }}
        disabled={isLoading}
        className="bg-white px-6 py-3 hover:bg-my-blue hover:text-white text-left"
      >
        <IoLogOut className="mr-2 inline-block" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default AdminProfileMenu;

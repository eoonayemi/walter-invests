import { RegisterFormData } from "./pages/user/Register";
import { LoginFormData } from "./pages/user/Login";
import { ChangePasswordFormData } from "./pages/user/ChangePassword";
import { BankType } from "./forms/BankAccountForm";
import { UserType } from "./pages/admin/UserDetails";
import { UserType as UserSlice } from "./redux/userSlice";
import { DepositFormData } from "./pages/user/DepositDetails";
import { WithdrawFormData } from "./pages/user/Withdrawal";
import { AdminProfileType } from "./pages/admin/AdminProfile";
import { AdminLoginFormData } from "./pages/admin/AdminLogin";

const API_BASE_URL = "";

export type BankDetailsType = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankType: string;
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody.message);
  }

  console.log(resBody);
};

export const LogIn = async (formData: LoginFormData) => {
  const res = await fetch(`${API_BASE_URL}/api/users-auth/login`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const LogAdminIn = async (formData: AdminLoginFormData) => {
  const res = await fetch(`${API_BASE_URL}/api/admins-auth/login`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const getBonus = async () => {
  const res = await fetch(`${API_BASE_URL}/api/admins/get-bonus`, {
    credentials: "include",
    method: "POST",
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const getLink = async () => {
  const res = await fetch(`${API_BASE_URL}/api/admins/get-link`, {
    credentials: "include",
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const validateToken = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users-auth/validate-token`, {
    credentials: "include",
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const validateAdminToken = async () => {
  const res = await fetch(`${API_BASE_URL}/api/admins-auth/validate-token`, {
    credentials: "include",
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const makeDeposit = async (data: DepositFormData) => {
  const res = await fetch(`${API_BASE_URL}/api/my-transactions/deposit`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const getMyDeposits = async () => {
  const res = await fetch(`${API_BASE_URL}/api/my-transactions/deposit`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get transactions");
  }

  return res.json();
};

export const makeWithdrawal = async (data: WithdrawFormData) => {
  const res = await fetch(`${API_BASE_URL}/api/my-transactions/withdraw`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const getMyWithdrawals = async () => {
  const res = await fetch(`${API_BASE_URL}/api/my-transactions/withdraw`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get withdraw transactions");
  }

  return res.json();
};

export const getMyIncomes = async () => {
  const res = await fetch(`${API_BASE_URL}/api/my-transactions/income`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get income");
  }

  return res.json();
};

export const getMyTransactions = async () => {
  const res = await fetch(`${API_BASE_URL}/api/my-transactions`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get transactions");
  }

  return res.json();
};

export const addBank = async (data: BankDetailsType) => {
  const res = await fetch(`${API_BASE_URL}/api/users/add-bank`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const getBankDetails = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users/bank-details`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get bank details");
  }

  return res.json();
};

export const getCode = async () => {
  const res = await fetch(`${API_BASE_URL}/api/codes/random-code`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get code");
  }

  return res.json();
};

export const getAdminBankAcct = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users/admin-bank-account`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get admin bank");
  }

  return res.json();
};

export const changePassword = async (data: ChangePasswordFormData) => {
  const res = await fetch(`${API_BASE_URL}/api/users/change-password`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const logOut = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users-auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const logAdminOut = async () => {
  const res = await fetch(`${API_BASE_URL}/api/admins-auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

//Admin Related Endpoints

export const getAllPlans = async (currentPage: number) => {
  const res = await fetch(
    `${API_BASE_URL}/api/plans?currentPage=${currentPage}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get investment plans");
  }

  return res.json();
};

export const getAllProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/api/plans/products`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get investment products");
  }

  return res.json();
};

export const getMyInvestments = async (status: string) => {
  const res = await fetch(
    `${API_BASE_URL}/api/my-investments?status=${status}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get investments");
  }

  return res.json();
};

export const editPlan = async (data: FormData) => {
  const res = await fetch(`${API_BASE_URL}/api/plans/edit-plan`, {
    credentials: "include",
    method: "PUT",
    body: data,
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const addPlan = async (data: FormData) => {
  const res = await fetch(`${API_BASE_URL}/api/plans/add-plan`, {
    credentials: "include",
    method: "POST",
    body: data,
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const getAdminBank = async () => {
  const res = await fetch(`${API_BASE_URL}/api/admins/bank`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get bank details");
  }

  return res.json();
};

export const addAdminBank = async (data: BankType) => {
  const res = await fetch(`${API_BASE_URL}/api/admins/add-bank`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const editAdminBank = async (data: BankType) => {
  const res = await fetch(`${API_BASE_URL}/api/admins/edit-bank`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resBody = await res.json();

  if (!res.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

// export const changeAdminPassword = async (
//   data: never
// ) => {
//   const response = await fetch(`${API_BASE_URL}/api/admins/change-password`, {
//     method: "PUT",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   const resBody = await response.json();

//   if (!response.ok) {
//     throw new Error(resBody.message);
//   }

//   return resBody;
// };

export const deletePlan = async (planId: string) => {
  const res = await fetch(
    `${API_BASE_URL}/api/plans/delete-plan?planId=${planId}`,
    {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const resBody = await res.json();
    throw new Error(resBody.message);
  }

  return res.status;
};

export const getUsers = async ({
  currentPage,
  status,
}: {
  currentPage: number;
  status: string;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/admins/users?currentPage=${currentPage}&status=${status}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get users");
  }

  return res.json();
};

export const getDeposits = async ({
  currentPage,
  status,
}: {
  currentPage: number;
  status: string;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/transactions/deposits?currentPage=${currentPage}&status=${status}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get deposits");
  }

  return res.json();
};

export const getWithdrawals = async ({
  currentPage,
  status,
}: {
  currentPage: number;
  status: string;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/transactions/withdrawals?currentPage=${currentPage}&status=${status}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get withdrawals");
  }

  return res.json();
};

export const getTransactions = async ({
  currentPage,
  status,
}: {
  currentPage: number;
  status: string;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/transactions?currentPage=${currentPage}&status=${status}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get transactions");
  }

  return res.json();
};

export const getInvestments = async ({
  currentPage,
}: {
  currentPage: number;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/investments?currentPage=${currentPage}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get investments");
  }

  return res.json();
};

export const editUser = async ({
  data,
  userId,
  msg,
}: {
  data: UserType;
  userId: string | undefined;
  msg: string;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/edit-user/${userId}?msg=${msg}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const editAdmin = async ({
  data,
  adminId,
}: {
  data: AdminProfileType | { imageUrl: string | undefined };
  adminId: string | undefined;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admins/edit-admin/${adminId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const getUserById = async (userId: string | undefined) => {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get users");
  }

  return res.json();
};

export const getDashboardData = async () => {
  const res = await fetch(`${API_BASE_URL}/api/transactions/dashboard-data`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get dashboard data");
  }

  return res.json();
};

export const deleteUser = async (userId: string | undefined) => {
  const res = await fetch(
    `${API_BASE_URL}/api/users/delete-user?userId=${userId}`,
    {
      credentials: "include",
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.status;
};

export const searchPlans = async ({
  searchQuery,
  currentPage,
}: {
  searchQuery: string;
  currentPage: number;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/plans/search?query=${searchQuery}&page=${currentPage}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const resBody = await res.json();
    throw new Error(resBody.message);
  }

  return res.json();
};

export const searchUsers = async ({
  searchQuery,
  currentPage,
  status,
}: {
  searchQuery: string;
  currentPage: number;
  status: string;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/users/search?query=${searchQuery}&page=${currentPage}&status=${status}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const resBody = await res.json();
    throw new Error(resBody.message);
  }

  return res.json();
};

export const searchTransactions = async ({
  searchQuery,
  currentPage,
  status,
  type,
}: {
  searchQuery: string;
  currentPage: number;
  status: string;
  type: string;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/transactions/search?query=${searchQuery}&page=${currentPage}&status=${status}&type=${type}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const resBody = await res.json();
    throw new Error(resBody.message);
  }

  return res.json();
};

export const searchInvestments = async ({
  searchQuery,
  currentPage,
}: {
  searchQuery: string;
  currentPage: number;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/api/transactions/search?query=${searchQuery}&page=${currentPage}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const resBody = await res.json();
    throw new Error(resBody.message);
  }

  return res.json();
};

export const processTransanct = async (
  status: string,
  id: string,
  type: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/process-transact`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, transactId: id, type }),
    }
  );

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const loginAsUser = async (userId: string): Promise<UserSlice> => {
  const response = await fetch(`${API_BASE_URL}/api/users-auth/login-as-user`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

export const createInvestment = async (planId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/my-investments`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ planId }),
  });

  const resBody = await response.json();

  if (!response.ok) {
    throw new Error(resBody.message);
  }

  return resBody;
};

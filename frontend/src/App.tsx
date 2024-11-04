import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LogInPage from "./pages/user/Login";
import RegisterPage from "./pages/user/Register";
import DashboardPage from "./pages/user/Dashboard";
import ProductsPage from "./pages/user/Products";
import WalletPage from "./pages/user/Wallet";
import TeamPage from "./pages/user/Team";
import MyPage from "./pages/user/Me";
import AddBank from "./pages/user/AddBank";
import ChangePassword from "./pages/user/ChangePassword";
import BankDetails from "./pages/user/BankDetails";
import DepositRecords from "./pages/user/DepositRecords";
import IncomeRecords from "./pages/user/IncomeRecords";
import MakeDeposit from "./pages/user/MakeDeposit";
import MyRunningOrders from "./pages/user/MyRunningOrders";
import TransactionRecords from "./pages/user/TransactionRecords";
import Withdrawal from "./pages/user/Withdrawal";
import WithdrawalRecords from "./pages/user/WithdrawalRecords";
import { useAppContext } from "./contexts/AppContext";
import DepositDetails from "./pages/user/DepositDetails";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import ManagePlans from "./pages/admin/ManagePlans";
import BankAccount from "./pages/admin/BankAccount";
import AllUsers from "./pages/admin/AllUsers";
import ActiveUsers from "./pages/admin/ActiveUsers";
import BannedUsers from "./pages/admin/BannedUsers";
import PendingDeposits from "./pages/admin/PendingDeposits";
import ApprovedDeposits from "./pages/admin/ApprovedDeposits";
import DeclinedDeposits from "./pages/admin/DeclinedDeposits";
import AllDeposits from "./pages/admin/AllDeposits";
import PendingWithdrawals from "./pages/admin/PendingWithdrawals";
import ApprovedWithdrawals from "./pages/admin/ApprovedWithdrawals";
import DeclinedWithdrawals from "./pages/admin/DeclinedWithdrawals";
import AllWithdrawals from "./pages/admin/AllWithdrawals";
import Investments from "./pages/admin/Investments";
import Transactions from "./pages/admin/Transactions";
import UserDetails from "./pages/admin/UserDetails";
import AdminProfile from "./pages/admin/AdminProfile";
import MyCompletedOrders from "./pages/user/MyCompletedOrders";
import LayoutForWideScreen from "./layouts/LayoutForWideScreen";

function App() {
  const { isLoggedIn, isAdmin: admin } = useAppContext();

  return (
    <div className="select-none sm:bg-blue-950">
      <BrowserRouter>
        <Routes>
          {/* User Routes */}

          <Route element={<LayoutForWideScreen />}>
            <Route path="/login" element={<LogInPage />} />

            <Route path="/register" element={<RegisterPage />} />

            {isLoggedIn && (
              <Route path="/dashboard" element={<DashboardPage />} />
            )}

            {isLoggedIn && (
              <Route path="/products" element={<ProductsPage />} />
            )}

            {isLoggedIn && <Route path="/wallet" element={<WalletPage />} />}

            {isLoggedIn && <Route path="/team" element={<TeamPage />} />}

            {isLoggedIn && (
              <Route path="/user/add-bank" element={<AddBank />} />
            )}

            {isLoggedIn && (
              <Route
                path="/user/change-password"
                element={<ChangePassword />}
              />
            )}

            {isLoggedIn && (
              <Route path="/user/bank-details" element={<BankDetails />} />
            )}

            {isLoggedIn && (
              <Route
                path="/user/deposit/records"
                element={<DepositRecords />}
              />
            )}

            {isLoggedIn && (
              <Route path="/user/income/records" element={<IncomeRecords />} />
            )}

            {isLoggedIn && (
              <Route path="/user/deposit" element={<MakeDeposit />} />
            )}

            {isLoggedIn && (
              <Route path="/user/investments" element={<MyRunningOrders />} />
            )}

            {isLoggedIn && (
              <Route
                path="/user/investments/ended"
                element={<MyCompletedOrders />}
              />
            )}

            {isLoggedIn && (
              <Route
                path="/user/transaction/records"
                element={<TransactionRecords />}
              />
            )}

            {isLoggedIn && (
              <Route path="/user/withdraw" element={<Withdrawal />} />
            )}

            {isLoggedIn && (
              <Route
                path="/user/withdraw/records"
                element={<WithdrawalRecords />}
              />
            )}

            {isLoggedIn && <Route path="/user/profile" element={<MyPage />} />}

            {isLoggedIn && (
              <Route
                path="/user/deposit/deposit-details"
                element={<DepositDetails />}
              />
            )}
          </Route>
          {/* Admin Routes */}

          <Route path="/admin/login" element={<AdminLogin />} />

          {admin && (
            <Route
              path="/admin/dashboard"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/plans"
              element={
                <AdminLayout>
                  <ManagePlans />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="admin/bank-account"
              element={
                <AdminLayout>
                  <BankAccount />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <AllUsers />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/users/active"
              element={
                <AdminLayout>
                  <ActiveUsers />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/users/banned"
              element={
                <AdminLayout>
                  <BannedUsers />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/deposits/pending"
              element={
                <AdminLayout>
                  <PendingDeposits />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/deposits/approved"
              element={
                <AdminLayout>
                  <ApprovedDeposits />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/deposits/declined"
              element={
                <AdminLayout>
                  <DeclinedDeposits />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/deposits"
              element={
                <AdminLayout>
                  <AllDeposits />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/withdrawals/pending"
              element={
                <AdminLayout>
                  <PendingWithdrawals />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/withdrawals/approved"
              element={
                <AdminLayout>
                  <ApprovedWithdrawals />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/withdrawals/declined"
              element={
                <AdminLayout>
                  <DeclinedWithdrawals />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/withdrawals"
              element={
                <AdminLayout>
                  <AllWithdrawals />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/report/investments"
              element={
                <AdminLayout>
                  <Investments />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/report/transactions"
              element={
                <AdminLayout>
                  <Transactions />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/users/:userId"
              element={
                <AdminLayout>
                  <UserDetails />
                </AdminLayout>
              }
            />
          )}

          {admin && (
            <Route
              path="/admin/profile"
              element={
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              }
            />
          )}

          {isLoggedIn && (
            <Route path="/" element={<Navigate to="/dashboard" />} />
          )}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

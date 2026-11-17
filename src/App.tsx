import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "./components/layout/Header/Header";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Incomes from "./pages/Incomes";
import RecurringTransactions from "./pages/RecurringTransactions";
import Wallets from "./pages/Wallets";
import Categories from "./pages/Categories";
import LoginPage from "./pages/LoginPage/LoginPage";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import { useInviteEvents } from "./hooks/useInviteEvents";
import { useAuthStore } from "./stores/authStore";

function AuthenticatedApp({ children }: { children: ReactNode }) {
  useInviteEvents();
  return children;
}

function App() {
  const token = useAuthStore((state) => state.token);
  const workspaces = useAuthStore((state) => state.workspaces);

  if (!token) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <LoginPage />
      </>
    );
  }

  if (workspaces.length === 0) {
    return (
      <AuthenticatedApp>
        <Toaster position="top-right" richColors closeButton />
        <OnboardingPage />
      </AuthenticatedApp>
    );
  }

  return (
    <AuthenticatedApp>
      <BrowserRouter>
        <Header />
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/recurring" element={<RecurringTransactions />} />
          <Route path="/recurring-transactions" element={<RecurringTransactions />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </BrowserRouter>
    </AuthenticatedApp>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "./components/layout/Header/Header";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Incomes from "./pages/Incomes";
import Wallets from "./pages/Wallets";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, ArrowDownCircle } from "lucide-react";
import "./NavigationBar.css";

function NavigationBar() {
    const getLinkClass = ({ isActive }: { isActive: boolean }) => 
        isActive ? "nav-link active" : "nav-link";

    return (
        <nav className="nav-bar">
            <NavLink to="/" className={getLinkClass}>
                <LayoutDashboard size={16} /> Visão geral
            </NavLink>
            <NavLink to="/expenses" className={getLinkClass}>
                <ArrowDownCircle size={16} /> Despesas
            </NavLink>
            <NavLink to="/incomes" className={getLinkClass}>
                <Receipt size={16} /> Receitas
            </NavLink>
            <NavLink to="/wallets" className={getLinkClass}>
                <Wallet size={16} /> Carteiras
            </NavLink>
        </nav>
    );
}

export default NavigationBar;
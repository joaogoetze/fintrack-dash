import { useLocation } from "react-router-dom";

import MonthSlider from "../../ui/MonthSlider/MonthSlider";
import NavigationBar from "../NavigationBar/NavigationBar";
import WorkspaceSelector from "../WorkspaceSelector/WorkspaceSelector";

import "./Header.css";

const MONTH_INACTIVE_PATHS = new Set(["/wallets", "/recurring", "/recurring-transactions"]);

function Header() {
  const { pathname } = useLocation();
  const monthSliderInactive = MONTH_INACTIVE_PATHS.has(pathname);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-top-row">
          <div className="header-slider-col">
            <MonthSlider inactive={monthSliderInactive} />
          </div>
          <div className="header-user-col">
            <WorkspaceSelector />
          </div>
        </div>
        <div className="header-nav-row">
          <NavigationBar />
        </div>
      </div>
    </header>
  );
}

export default Header;

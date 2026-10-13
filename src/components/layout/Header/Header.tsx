import MonthSlider from "../../ui/MonthSlider/MonthSlider";
import NavigationBar from "../NavigationBar/NavigationBar";
import WorkspaceSelector from "../WorkspaceSelector/WorkspaceSelector";

import "./Header.css";

function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-top-row">
          <div className="header-slider-col">
            <MonthSlider />
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
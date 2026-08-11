import MonthSlider from "../../ui/MonthSlider/MonthSlider";
import NavigationBar from "../NavigationBar/NavigationBar";
import "./Header.css";

function Header() {
  return (
    <header className="app-header">
      <MonthSlider />
      <NavigationBar />
    </header>
  );
}

export default Header;
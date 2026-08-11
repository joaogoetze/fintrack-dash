import { useEffect, useRef } from "react";
import { generateMonths, getShortMonthName, keyToDate } from "../../../utils/monthUtils";
import { useMonthStore } from "../../../stores/monthStore";
import "./MonthSlider.css";

function MonthSlider() {
  const activeMonth = useMonthStore((state) => state.activeMonth);
  const setActiveMonth = useMonthStore((state) => state.setActiveMonth);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const start = new Date();
  start.setMonth(start.getMonth() - 12);
  const months = generateMonths(start, 25);

  useEffect(() => {
    if (sliderRef.current) {
      const activeEl = sliderRef.current.querySelector(".month-item.active") as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeMonth]);

  return (
    <div className="month-slider">
      <div className="month-slider-track" ref={sliderRef}>
        {months.map((month) => {
          const isActive = month === activeMonth;
          const date = keyToDate(month);
          const year = date.getFullYear();
          const currentYear = new Date().getFullYear();
          const label = year !== currentYear
            ? `${getShortMonthName(month)} ${year}`
            : getShortMonthName(month);

          return (
            <button
              key={month}
              className={`month-item${isActive ? " active" : ""}`}
              onClick={() => setActiveMonth(month)}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MonthSlider;

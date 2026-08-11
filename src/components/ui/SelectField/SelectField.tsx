import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import "./SelectField.css";

interface SelectFieldProps {
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

function SelectField({ id, value, onChange, children }: SelectFieldProps) {
  return (
    <div className="select-wrapper">
      <select id={id} value={value} onChange={onChange}>
        {children}
      </select>
      <span className="select-chevron">
        <ChevronDown size={16} />
      </span>
    </div>
  );
}

export default SelectField;

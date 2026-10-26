import { todayLocal } from "../../../utils/formatters";

interface DateInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  "aria-invalid"?: boolean;
}

function DateInput({
  id,
  value,
  onChange,
  "aria-invalid": ariaInvalid,
}: DateInputProps) {
  return (
    <input
      id={id}
      type={value ? "date" : "text"}
      placeholder="Nenhuma data selecionada"
      value={value}
      aria-invalid={ariaInvalid}
      onFocus={(e) => {
        if (!value) {
          const today = todayLocal();
          e.target.value = today;
          onChange(today);
        }
        e.target.type = "date";
      }}
      onBlur={(e) => {
        if (!e.target.value) e.target.type = "text";
      }}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default DateInput;

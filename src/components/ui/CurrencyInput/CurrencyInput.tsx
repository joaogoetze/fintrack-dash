import { useLayoutEffect, useRef } from "react";

import {
  centsToReais,
  formatCentsToBRL,
  parseDigitsToCents,
  reaisToCents,
} from "../../../utils/formatters";

import "./CurrencyInput.css";

interface CurrencyInputProps {
  id: string;
  value: number;
  onChange: (reais: number) => void;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  allowNegative?: boolean;
}

function CurrencyInput({
  id,
  value,
  onChange,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  allowNegative = false,
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cents = reaisToCents(value);
  const display = formatCentsToBRL(cents);

  const moveCaretToEnd = () => {
    const input = inputRef.current;
    if (!input) return;
    const end = input.value.length;
    input.setSelectionRange(end, end);
  };

  useLayoutEffect(() => {
    moveCaretToEnd();
  }, [display]);

  const emitCents = (nextCents: number) => {
    onChange(centsToReais(nextCents));
  };

  const handleChange = (raw: string) => {
    const nextCents = parseDigitsToCents(raw);
    const signed = allowNegative && cents < 0 && nextCents !== 0 ? -nextCents : nextCents;
    emitCents(signed);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      className="currency-input"
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={display}
      aria-invalid={ariaInvalid}
      aria-required={ariaRequired}
      onClick={moveCaretToEnd}
      onFocus={moveCaretToEnd}
      onKeyUp={moveCaretToEnd}
      onKeyDown={(e) => {
        if (allowNegative && (e.key === "-" || e.key === "Minus")) {
          e.preventDefault();
          if (cents !== 0) emitCents(-cents);
        }
      }}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}

export default CurrencyInput;

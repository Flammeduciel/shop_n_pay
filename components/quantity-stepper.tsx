"use client";

import { MAX_QUANTITY_PER_LINE } from "@/lib/cart";
import { MinusIcon, PlusIcon } from "./icons";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  max?: number;
};

export function QuantityStepper({
  value,
  onChange,
  label,
  max = MAX_QUANTITY_PER_LINE,
}: QuantityStepperProps) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={`Diminuer la quantité de ${label}`}
      >
        <MinusIcon size={16} />
      </button>
      <span className="stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Augmenter la quantité de ${label}`}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PricingTierProps {
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  value: number;
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

export function PricingTier({
  title,
  description,
  price,
  discountedPrice,
  value,
  selectedValue,
  onSelect,
}: PricingTierProps) {
  const isSelected = selectedValue === value;

  React.useEffect(() => {
    if (selectedValue === value) {
        localStorage.setItem("selectedValue", JSON.stringify(selectedValue));
    }
    []}, [selectedValue]);

  return (
    <div
      onClick={() => onSelect(value)}
      className={`w-full p-6 border border-gray-300 rounded-lg shadow-md my-1 cursor-pointer ${
        isSelected ? "bg-green-100" : "bg-white"
      }`}
    >
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-2 w-1/2">
          <section className="my-auto flex justify-start">
            <RadioGroupItem
              value={String(value)}
              id={`buy-${value}`}
              checked={isSelected}
            />
          </section>
          <section>
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-sm text-gray-600">
              £{discountedPrice.toFixed(2)}
            </div>
          </section>
        </div>
        <div className="flex justify-end flex-col w-full text-right">
          <div className="text-sm text-gray-600">{description}</div>
          <div className="text-sm text-gray-600 line-through">
            £{price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
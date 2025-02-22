interface BuyNowProps {
  onClick: () => void;
  selectedValue: number;
  loading: boolean;
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";

const BuyNowButton = ({ onClick, selectedValue, loading }: BuyNowProps) => {
  return (
        <Button
          className="w-full"
          disabled={!selectedValue || loading}
          variant={"outline"}
          onClick={onClick}
        >
          Buy Now
        </Button>
  );
};

export default BuyNowButton;

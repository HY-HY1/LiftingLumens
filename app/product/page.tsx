"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ImageDialogContent } from "@/components/layout/product/ImageDialog";
import { ImageCarousel } from "@/components/layout/product/ImageCarousel"; 
import { ProductAccordions } from "@/components/layout/product/Accordions";
import { PricingTier } from "@/components/layout/product/PricingTiers";
import { RadioGroup } from "@/components/ui/radio-group";
import { useCart } from "@/context/cartContext"; // Import cart context
import { CartSheetContent } from "@/components/layout/product/CartSheet";
import { SheetTrigger, Sheet } from "@/components/ui/sheet";
import BuyNowButton from "@/components/common/buttons/BuyNow";
import { DialogContent } from "@radix-ui/react-dialog";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const imgArray = [
  "https://posinglamp.com/cdn/shop/files/fin3.png?v=1738249645&width=1946",
  "https://posinglamp.com/cdn/shop/files/0001.png?v=1738423092&width=990",
  "https://posinglamp.com/cdn/shop/files/fin3.png?v=1738249645&width=1946",
  "https://posinglamp.com/cdn/shop/files/0001.png?v=1738423092&width=990",
];

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null); 

  const { addToCart, removeFromCart } = useCart();

  const handleSelect = (value: number) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const quantity: string = localStorage.getItem("selectedValue") || "1";
    const priceId = "price_1QtxAjEobVR8O8G71Q2uT1mP";

    const response = await fetch("/api/stripe/checkout/external", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId, quantity: parseInt(quantity) }),
    });

    const session = await response.json();

    if (!stripe) {
      console.error("Stripe has not loaded");
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error("Stripe Checkout error:", error.message);
    }
  };

  const selectOptionWarning = () => {
    if (!selectedValue || loading) {
      toast("Please select an option", {
        description: "Please select an option before adding to cart",
      });
      return true; // return true to indicate that the selection was invalid
    }
    return false; // selection is valid
  };
  
  const handleAddToCart = () => {
    if (selectOptionWarning()) return; // If warning is triggered, stop the execution
  
    if (!selectedValue) return;
    addToCart(selectedValue.toString()); // Ensure product ID is correct
    toast("Item Added to cart", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => removeFromCart(selectedValue.toString()),
      },
    });
  };
  
  

  return (
    <Dialog>
      <Sheet>
        <div className="md:w-[70vw] w-[90vw] m-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <ImageCarousel arr={imgArray} />
              <div className="grid grid-cols-4 gap-4 py-4 my-2 border-opacity-20 border-black border-t h-full">
                {imgArray.map((img, index) => (
                  <div className="w-full" key={index}>
                    <Dialog>
                      <DialogTrigger>
                        <img
                          src={img}
                          alt="product"
                          className="w-full rounded-md border hover:opacity-90 cursor-pointer"
                        />
                      </DialogTrigger>
                      <ImageDialogContent img={img} />
                    </Dialog>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <header>
                <p>Lifting Lumens</p>
                <h1>Liftlight Pro</h1>
                <div className="border-b-2 border-gray-300 my-4"></div>
                <p>
                  The Liftlight Pro is a sleek, adjustable gym lamp that
                  enhances your workout space. With customizable brightness, it
                  creates the perfect lighting for lifting, stretching, and
                  posing in any setting.
                </p>
              </header>
              <div className="py-6">
                <ProductAccordions />
              </div>
              <RadioGroup
                value={selectedValue ? String(selectedValue) : ""}
                onValueChange={(value) => handleSelect(Number(value))}
              >
                <PricingTier
                  title="Buy 1"
                  description="Regular Price"
                  price={15}
                  discountedPrice={10}
                  value={1}
                  selectedValue={selectedValue}
                  onSelect={handleSelect}
                />
                <PricingTier
                  title="Buy 2"
                  description="Regular Price"
                  price={30}
                  discountedPrice={25}
                  value={2}
                  selectedValue={selectedValue}
                  onSelect={handleSelect}
                />
                <PricingTier
                  title="Buy 3"
                  description="Regular Price"
                  price={45}
                  discountedPrice={35}
                  value={3}
                  selectedValue={selectedValue}
                  onSelect={handleSelect}
                />
              </RadioGroup>
                <div className="w-full  cursor-pointer" onClick={selectOptionWarning}>
                <SheetTrigger asChild className="w-full" disabled={!selectedValue || loading}>
                  <Button
                  onClick={handleAddToCart}
                  disabled={!selectedValue || loading}
                  className="w-full mt-6"
                  >
                  {loading ? "Processing..." : "Add To Cart"}
                  </Button>
                </SheetTrigger>
                </div>
              <div className="w-full py-2">
               <BuyNowButton onClick={handleCheckout} selectedValue={selectedValue || 0} loading={loading}/>
              </div>
            </div>
          </div>
        </div>
        <CartSheetContent />
      </Sheet>
    </Dialog>
  );
};

export default Page;

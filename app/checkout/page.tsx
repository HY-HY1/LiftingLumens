"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/cartContext";
import CartItems from "@/components/layout/cart/CartItem";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/layout/checkout/checkoutForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutPage = () => {
  const { cart, totalPrice: totalPriceString, applyDiscount, discountAmount } = useCart();
  const totalPrice = parseFloat(totalPriceString);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    try {
      const res = await axios.post('/api/verifyCoupon', { couponCode });
      
      if (res.data.valid) {
        applyDiscount(res.data.discount.value);
        localStorage.setItem("promotionCodeId", res.data.promotionCodeId);
        setError(null);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Invalid coupon code");
      applyDiscount(0);
      localStorage.removeItem("promotionCodeId");
    }
  };

  // Calculate discounted price
  const calculateDiscountedTotal = () => {
    if (discountAmount > 0) {
      return totalPrice * (1 - discountAmount / 100);
    }
    return totalPrice;
  };

  return (
    <div className="w-[95vw] md:w-[80vw] m-auto max-h-[90vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:flex-row-reverse">
        <div className="py-6 px-4 border-r h-full">
          <h3 className="text-2xl font-semibold mb-4">Checkout</h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>

        <div className="py-6 px-4">
          <div className="w-full border-b">
            <h3 className="text-2xl font-semibold mb-4">Your Cart</h3>
            <CartItems items={cart} />
          </div>
          <div className="w-[90%] mx-auto mt-4 space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleApplyCoupon}>Apply</Button>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>£{calculateDiscountedTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
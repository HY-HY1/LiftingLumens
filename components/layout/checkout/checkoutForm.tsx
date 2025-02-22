"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import useRegister from "@/hooks/Customer/useRegister";
import useCreateAddress from "@/hooks/Customer/useAddress";
import useOrder from "@/hooks/Customer/useOrder";

// Define the type for the response from createOrder

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart, discountAmount } = useCart();
  const { register } = useRegister();
  const { createAddress } = useCreateAddress();
  const { createOrder } = useOrder();

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    postcode: "",
    city: "",
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      if (!stripe || !elements) throw new Error("Payment system not ready");
      if (!formData.termsAccepted) throw new Error("You must accept the terms and conditions");
  
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card details incomplete");
  
      const response = await fetch("/api/stripe/checkout/intergrated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          email: formData.email,
          address: formData.address,
          postcode: formData.postcode,
          city: formData.city,
          coupon: localStorage.getItem("couponID") || null,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment request failed");
      }
  
      const { clientSecret } = await response.json();
  
      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.address,
              postal_code: formData.postcode,
              city: formData.city,
            },
          },
        },
      });
  
      if (paymentError) throw paymentError;
  
      clearCart();
      await register({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      await createAddress({
        street: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        email: formData.email,
      });
  
      // Ensure the result from createOrder is handled as CreateOrderResponse
      const orderResponse: CreateOrderResponse = await createOrder(formData.email, clientSecret);
  
      const uuid = orderResponse.uuid ; // Now this is correctly typed
  
      if (uuid) {
        router.push(`/success?uuid=${uuid}`);
      } else {
        router.push(`/success?uuid=0`);
      }
    } catch (err: any) {
      setError(err.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Billing Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Delivery Address</Label>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Card Details</Label>
          <div className="p-3 border rounded-md">
            <CardNumberElement />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Expiration Date</Label>
            <div className="p-3 border rounded-md">
              <CardExpiryElement />
            </div>
          </div>
          <div>
            <Label>CVC</Label>
            <div className="p-3 border rounded-md">
              <CardCvcElement />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          required
          className="h-4 w-4"
        />
        <Label htmlFor="termsAccepted">I accept the terms and conditions</Label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading || !stripe}
        className="w-full"
        aria-disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default CheckoutForm;

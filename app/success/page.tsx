"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import useNodeMailer from "@/hooks/useNodeMailer";
import { ResponseTypes } from "@/types/response/Response";

const Page = () => {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");
  const [orderValid, setOrderValid] = useState<boolean | null>(null);

  const { sendEmail, loading, error } = useNodeMailer();

  useEffect(() => {
    const verifyOrder = async () => {
      if (!uuid) {
        setOrderValid(false);
        return;
      }

      try {
        const response = await axios.get(`/api/customer/order/uuid?uuid=${uuid}`);
        const data: IOrder & ResponseTypes = response.data;

        if (data.success) {
          setOrderValid(true);
          await sendEmail({
            to: data.data.email,
            subject: "Order Confirmation",
            text: `Your order with the ID ${data.data.uuid} has been confirmed.`,
          });
        } else {
          setOrderValid(false);
        }
      } catch (error) {
        console.error(error);
        setOrderValid(false);
      }
    };

    verifyOrder();
  }, [uuid]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {orderValid === null ? (
        <p>Verifying your order...</p>
      ) : orderValid ? (
        <h2 className="text-xl font-semibold">✅ Thank you for your order!</h2>
      ) : (
        <h2 className="text-xl font-semibold text-red-500">❌ Order not found.</h2>
      )}
    </div>
  );
};

export default Page;

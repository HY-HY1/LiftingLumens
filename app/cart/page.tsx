"use client";

import CartItems from "@/components/layout/cart/CartItem";
import { Button } from "@/components/ui/button";
import { CartProvider, useCart } from "@/context/cartContext";
import { ProductProvider, useProduct } from "@/context/productContext";
import Link from "next/link";
import React from "react";

const Page = () => {
  const { cart, cartItemsWithDetails, totalPrice, calculateDiscountedTotal } =
    useCart();
  const { getProductById } = useProduct();
  return (
    <section className="min-h-screen  py-10 lg:w-[70vw] xl:w-[50vw] w-[95vw] m-auto">
      <header className="max-w-4xl mx-auto border-b pb-4 ">
        <h2 className="text-2xl font-semibold text-center">Shopping Cart</h2>
      </header>
      <CartItems items={cartItemsWithDetails} />
      {cartItemsWithDetails.length > 0 ? (
        <div className="mt-4 w-full ">
          <p className="flex w-full justify-center md:justify-end ">
            Subtotal: ${Number(totalPrice).toFixed(2)}
          </p>
          <span className="flex w-full justify-center md:justify-end py-2">
            <Link href={"/checkout"}>
              <Button className="w-full md:max-w-[200px]" variant={"default"}>
                <p>Proceed To Checkout</p>
              </Button>
            </Link>
          </span>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
};

export default Page;

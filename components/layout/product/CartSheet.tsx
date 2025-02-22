"use client";

import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CartItems from "../cart/CartItem";
import { useCart } from "@/context/cartContext";
import { useProduct } from "@/context/productContext";
import Link from "next/link";
import { Sheet } from "lucide-react";

export function CartSheetContent() {
  const { cart, cartItemsWithDetails, totalPrice } = useCart();
  const { getProductById } = useProduct(); // Fetch product details using id

  return (
    <SheetContent className="min-w-[90vw] md:min-w-[600px] bg-white max-w-full mx-auto rounded-lg">
      <SheetHeader>
        <SheetTitle className="flex w-[95%] h-full flex-row">
          <p className="flex flex-row w-full">Shopping Cart</p>
          <span className="w-full flex justify-end">
            <SheetClose asChild>
            <Link href={"/cart"}>
              <Button
              variant={"outline"}
               className=" ">
                <p>Go to cart</p>
              </Button>
            </Link>
            </SheetClose>
          </span>
        </SheetTitle>
        <SheetDescription>Find all your products here</SheetDescription>
      </SheetHeader>
      <CartItems items={cartItemsWithDetails} />
      {cartItemsWithDetails.length > 0 && (
        <div className="flex justify-between items-center px-4 py-3 border-t mt-4">
          <div className="text-lg">
            <p>Subtotal: £{totalPrice}</p>
          </div>
          <div className="flex gap-3">
            <SheetClose asChild>
              <Link href="/checkout">
                <Button>Checkout</Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      )}
    </SheetContent>
  );
}

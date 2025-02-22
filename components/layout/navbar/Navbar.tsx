import React from "react";
import Link from "next/link";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CartSheetContent } from "../product/CartSheet";

const Navbar = () => {
  return (
    <Sheet>
      <nav className="w-full h-16 border-b border-opacity-20 flex items-center z-50 ">
        <div className="w-[80vw] m-auto grid grid-cols-3 items-center h-full">
          <div className="flex justify-start">
            <h3 className="text-lg font-semibold">Lifting Lumens</h3>
          </div>
          <div className="flex justify-center"></div>
          <div className="flex justify-end h-full">
            <ul className="flex space-x-6 items-center h-full">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/product">LiftLight Pro</Link>
              </li>
              <li>
                <SheetTrigger>Cart</SheetTrigger>
                
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <CartSheetContent/>
    </Sheet>
  );
};

export default Navbar;

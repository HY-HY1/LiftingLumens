"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/context/cartContext";
import { useProduct } from "@/context/productContext";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the structure of a CartItem
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Define the props for the CartItems component
interface CartItemsProps {
  items: CartItem[];
}

const CartItems: React.FC<CartItemsProps> = ({ items }: any) => {
  const { getProductById } = useProduct();
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = () => {
      if (!Array.isArray(items)) {
        console.error("Expected 'items' to be an array, but got:", items);
        setCartItemsWithDetails([]); // Set empty array if 'items' is invalid
        setLoading(false); // Stop loading even if items are not valid
        return;
      }

      const productsWithDetails = items
        .map(({ id, quantity }: any) => {
          const cleanId = id.replace("product_", ""); // Clean ID
          const product = getProductById(cleanId); // Fetch product by cleaned ID
          if (!product) {
            console.log("Product not found for id:", cleanId); // Log missing products
            return null; // If product not found, return null
          }
          return { ...product, quantity }; // Return product with quantity
        })
        .filter(Boolean); // Remove any null values (products not found)

      setCartItemsWithDetails(productsWithDetails); // Set products with details
      setLoading(false); // Loading finished
    };

    fetchProducts(); // Call on initial render or items change
  }, [items, getProductById]);

  if (loading) {
    return <div>Loading cart...</div>; // Show loading state
  }

  return (
    <div className="w-full max-w-full mx-auto mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItemsWithDetails.length > 0 ? (
            cartItemsWithDetails.map(
              (item: any) =>
                item && (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>£{item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      £{(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="ml-2 text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <p className="py-2">Your cart is empty. </p>
                <Link href={"/product"}>
                  <Button variant={"outline"}>Start Shopping</Button>
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CartItems;

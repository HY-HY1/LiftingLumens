"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useProduct } from "@/context/productContext";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartContextType = {
  cart: CartItem[];
  cartItemsWithDetails: CartItem[];
  totalPrice: string;
  discountAmount: number; // Add this line to track the discount amount
  discountedPrice: (discount: number) => void; // Add this line to track the discounted price
  calculateDiscountedTotal: () => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyDiscount: (discount: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getProductById } = useProduct();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>("0.00");
  const [discountAmount, setDiscountAmount] = useState<number>(0); // Initialize discountAmount state

  // Load cart from localStorage on mount
  useEffect(() => {
    if (!getProductById) {
      return;
    }
    
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const savedItems = JSON.parse(savedCart) as {
        id: string;
        quantity: number;
      }[];

      const fullCart = savedItems
        .map(({ id, quantity }) => {
          const product = getProductById(id);
          return product ? { ...product, quantity } : null;
        })
        .filter(Boolean) as CartItem[];

      setCart(fullCart);
    }
  }, [getProductById]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity })))
    );
    updateTotalPrice();
  }, [cart]);

  // Calculate and set the total price
  const updateTotalPrice = () => {
    const price = cart
      .reduce((acc, { price, quantity }) => acc + (price ?? 0) * quantity, 0)
      .toFixed(2);
    setTotalPrice(price);
  };


  const calculateDiscountedTotal = () => {
    if (discountAmount > 0) {
      return totalPrice as any * (1 - discountAmount / 100);
    }
    return totalPrice;
  };

  const addToCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const product = getProductById(productId);
      if (!product) {
        console.warn("Product not found:", productId);
        return prevCart;
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartItemsWithDetails = cart
    .map(({ id, quantity }) => {
      const product = getProductById(id);
      return product ? { ...product, quantity } : null;
    })
    .filter(
      (
        item
      ): item is {
        id: string;
        quantity: number;
        name: string;
        price: number;
        image: string;
      } => item !== null
    );

  const applyDiscount = (discount: number) => {
    setDiscountAmount(discount); // Set the discount amount in the state
    const priceAfterDiscount = (
      parseFloat(totalPrice) *
      (1 - discount / 100)
    ).toFixed(2);
    setTotalPrice(priceAfterDiscount); // Update total price
  };

  const discountedPrice = (discount: number) =>  {
    return parseFloat(totalPrice) * (1 - discount/100);
  } 

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemsWithDetails,
        totalPrice,
        discountAmount, // Add this line
        discountedPrice,
        calculateDiscountedTotal,
        addToCart,
        removeFromCart,
        clearCart,
        applyDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

const imgArray = [
  "https://posinglamp.com/cdn/shop/files/fin3.png?v=1738249645&width=1946",
  "https://posinglamp.com/cdn/shop/files/0001.png?v=1738423092&width=990",
  "https://posinglamp.com/cdn/shop/files/fin3.png?v=1738249645&width=1946",
  "https://posinglamp.com/cdn/shop/files/0001.png?v=1738423092&width=990",
];

const products = [
  { id: "1", name: "Lifting Lantern ", price: 20, image: imgArray[0] },
  { id: "2", name: "Lifting Lantern  - 2 Pack", price: 35, image: imgArray[1] },
  { id: "3", name: "Lifting Lantern - 3 Pack", price: 45, image: imgArray[2] },
];

type ProductContextType = {
  products: typeof products;
  imgArray: string[];
  updateProductImage: (id: string, index: number) => void;
  getProductById: (id: string) => typeof products[0] | null;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

type ProductProviderProps = { children: ReactNode };

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [currentProducts, setCurrentProducts] = useState(products);

  const updateProductImage = (id: string, index: number) => {
    setCurrentProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, image: imgArray[index] } : product
      )
    );
  };

  const getProductById = (id: string) => {
    return currentProducts.find((product) => product.id === id) || null;
  };

  return (
    <ProductContext.Provider
      value={{ products: currentProducts, imgArray, updateProductImage, getProductById }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

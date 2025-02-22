import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar/Navbar";
import { CartProvider } from "@/context/cartContext";
import { ProductProvider } from "@/context/productContext";
import { Toaster } from "sonner";

// Import Roboto with weights defined
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"], // Add desired weights
});

// Import Montserrat with a similar structure
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"], // Add desired weights
});

export const metadata = {
  title: "Lifting Lumens",
  description: "Premium lighting for gym-goers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProductProvider>
    <CartProvider>
    <html lang="en">
      <body
        className={`${roboto.variable} ${montserrat.variable} antialiased`}
      >
        <Navbar/>
        {children}
        <Toaster/>
      </body>
    </html>
    </CartProvider>
    </ProductProvider>
  );
}

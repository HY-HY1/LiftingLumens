"use client";

import { useState } from "react";
import axios from "axios";
import EmailForm from "@/components/layout/auth/emailForm"; // Import the EmailForm component

export default function AccountPage() {
  const [pageState, setPageState] = useState<
    "loading" | "register" | "login" | "error" | "success"
  >("register");
  const [email, setEmail] = useState<string | null>(null);

  // Handle form submission
  const onSubmit = async (data: { email: string }) => {
    try {
      // Set loading state while checking
      setPageState("loading");
      const response = await axios.post("/api/auth/conditional", {
        email: data.email,
      });

      if (response.status === 200) {
        setPageState("success"); // User might need to set a password
      } else if (response.status === 400) {
        setPageState("login"); // User exists, show login page
      } else if (response.status === 404) {
        setPageState("register"); // User doesn't exist, show register page
      }
      setEmail(data.email);
    } catch (error) {
      setPageState("error"); // Handle error
      console.error("Error checking user:", error);
    }
  };

  return (
    <section className="w-full h-[100vh] flex justify-center content-center m-auto bg-yellow-50">
      <div className=" w-[30vw] h-full m-0  p-8">
        {/* Conditional rendering based on pageState */}
        {pageState === "loading" && <p>Loading...</p>}
        {pageState === "error" && (
          <p className="text-red-500">An error occurred. Please try again.</p>
        )}
        {pageState === "success" && (
          <div>
            <h2 className="text-xl">Success!</h2>
            <p>Email: {email}</p>
            <p>You may need to set your password now.</p>
          </div>
        )}
        {pageState === "login" && (
          <div>
            <h2 className="text-xl">Login</h2>
            <p>We already have an account with this email. Please log in.</p>
          </div>
        )}
        {pageState === "register" && (
          <div>
            <h2 className="text-xl">Register</h2>
            <p>No account found for this email. Please register to continue.</p>
          </div>
        )}

        {/* Render the form only when the pageState is register or login */}
        {(pageState === "register" || pageState === "login") && (
          <EmailForm onSubmit={onSubmit} />
        )}
      </div>
    </section>
  );
}

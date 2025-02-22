import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

interface ConditionalResponse {
  fetchConditionalData: (email: string) => Promise<boolean | undefined>;
}

export function useConditional(): ConditionalResponse {
  const fetchConditionalData = async (email: string): Promise<boolean | undefined> => {
    if (!email) {
      console.log("no email found")
      return
    }; // If no email is provided, exit early

    try {
      const response = await axios.post("/api/auth/conditional", { email });
      console.log(response)
      const data: AxiosResponse = response.data;

      if (data.status === 200) {
        // Handle redirection or state change (e.g., set password)
        return undefined; // No customer check needed, user might need to set password
      } else if (data.status === 400) {
        return true; // Customer exists, show login
      } else if (data.status === 404) {
        return false; // Customer doesn't exist, show register
      }
    } catch (err) {
      console.error("Error in fetching conditional data:", err);
      return undefined; // Handle error case
    }
  };

  return { fetchConditionalData };
}

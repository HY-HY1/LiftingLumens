import { useState } from 'react';

interface Order {
  _id: string;
  uuid: string;
  email: string;
  clientSecret: string;
  createdAt: string;
  // Add other fields based on your order model
}


interface UseOrderResponse {
  orders: Order[] | null;
  error: string | null;
  loading: boolean;
  createOrder: (email: string, clientSecret: string) => Promise<CreateOrderResponse>;
}

const useOrder = (): UseOrderResponse => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/customer/order');
      const data = await response.json();

  
      if (data.success) {
        setOrders(data.data); // Assuming data contains an array of orders
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      console.error(err); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  // Create an order
  const createOrder = async (email: string, clientSecret: string): Promise<CreateOrderResponse> => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/customer/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, clientSecret }),
      });
  
      const data = await response.json();
  

      console.log("create order response data",data.data.uuid); // Debugging log to check the response


      if (data.success && data.data.uuid) {
        return { uuid: data.data.uuid }; // Return uuid as part of CreateOrderResponse
      } else {
        setError('Failed to create order');
        throw new Error('Failed to create order');
      }
    } catch (err) {
      setError('An error occurred while creating the order');
      console.error(err); // Log error for debugging
      throw err; // Rethrow the error to be handled later
    } finally {
      setLoading(false);
    }
  };
  

  return {
    orders,
    error,
    loading,
    createOrder,
  };
};

export default useOrder;

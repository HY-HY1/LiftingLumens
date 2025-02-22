import { useState } from 'react';

interface Address {
    email: string;
    street: string;  // Make sure to use "street" here
    city: string;
    postcode: string;
}

const useCreateAddress = () => {
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createAddress = async (newAddress: Address) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/customer/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAddress),
            });

            if (!response.ok) {
                throw new Error('Failed to create address');
            }

            const data = await response.json();
            setAddress(data);
        } catch (err) {
            setError('Failed to create address');
        } finally {
            setLoading(false);
        }
    };

    return { address, loading, error, createAddress };
};

export default useCreateAddress;

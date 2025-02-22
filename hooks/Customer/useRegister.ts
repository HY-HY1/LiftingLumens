import { useState } from 'react';
import axios from 'axios';

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
}

interface RegisterResponse {
    success: boolean;
    message: string;
}

const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterData): Promise<RegisterResponse> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/customer/register', data);
            setLoading(false);
            return { success: true, message: response.data.message };
        } catch (err:any) {
            setLoading(false);
            setError(err.response?.data?.message || 'Registration failed');
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    return { register, loading, error };
};

export default useRegister;
import { useState } from 'react';

interface EmailProps {
  to: string;
  subject: string;
  text: string;
  html?: string; // Optional HTML support
}

interface UseNodeMailerResponse {
  sendEmail: (emailProps: EmailProps) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useNodeMailer = (): UseNodeMailerResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async ({ to, subject, text, html }: EmailProps) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/nodemailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, text, html }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Email sent successfully:', data.message);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error while sending email:', err);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
};

export default useNodeMailer;

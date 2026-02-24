import { useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import PaymentSuccess from '../components/PaymentSuccess';

export interface PaymentDetails {
  receiverName: string;
  receiverPhone: string;
  amount: string;
  transactionId: string;
  timestamp: string;
}

export default function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  const handlePaymentSubmit = (name: string, phone: string, amount: string) => {
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const timestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setPaymentDetails({
      receiverName: name,
      receiverPhone: phone,
      amount,
      transactionId,
      timestamp
    });
  };

  const handleReset = () => {
    setPaymentDetails(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      {!paymentDetails ? (
        <PaymentForm onSubmit={handlePaymentSubmit} />
      ) : (
        <PaymentSuccess details={paymentDetails} onReset={handleReset} />
      )}
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { IndianRupee, User, Phone } from 'lucide-react';

interface PaymentFormProps {
  onSubmit: (name: string, phone: string, amount: string) => void;
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    amount?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!receiverName.trim()) {
      newErrors.name = 'Receiver name is required';
    }

    if (!receiverPhone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(receiverPhone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(receiverName.trim(), receiverPhone.trim(), amount.trim());
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setReceiverPhone(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    // Allow only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) return;
    setAmount(value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <img 
              src="/assets/generated/pe-logo.dim_200x200.png" 
              alt="पे" 
              className="h-16 w-16 rounded-xl"
            />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-phonepe-primary">
            Send Money
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="receiverName" className="text-sm font-semibold text-gray-700">
                Receiver Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-phonepe-primary/60" />
                <Input
                  id="receiverName"
                  type="text"
                  placeholder="Enter receiver's name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-phonepe-primary focus:ring-phonepe-primary"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverPhone" className="text-sm font-semibold text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-phonepe-primary/60" />
                <Input
                  id="receiverPhone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={receiverPhone}
                  onChange={handlePhoneChange}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-phonepe-primary focus:ring-phonepe-primary"
                  maxLength={10}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">
                Amount
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-phonepe-primary/60" />
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-phonepe-primary focus:ring-phonepe-primary text-lg font-semibold"
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-phonepe-primary to-phonepe-secondary text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Pay Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

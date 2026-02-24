import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, User, Phone, IndianRupee, Calendar, Hash } from 'lucide-react';
import type { PaymentDetails } from '../pages/PaymentPage';

interface PaymentSuccessProps {
  details: PaymentDetails;
  onReset: () => void;
}

export default function PaymentSuccess({ details, onReset }: PaymentSuccessProps) {
  return (
    <Card className="w-full max-w-md border-0 bg-white shadow-2xl">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-phonepe-primary via-phonepe-secondary to-phonepe-accent p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-white/30"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <CheckCircle2 className="h-16 w-16 text-green-500 drop-shadow-2xl" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-white">Payment Successful!</h2>
          <p className="text-white/90">Your payment has been processed</p>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl bg-gradient-to-br from-phonepe-light to-phonepe-lighter p-6 text-center">
            <p className="mb-1 text-sm font-medium text-phonepe-primary/70">Amount Paid</p>
            <div className="flex items-center justify-center gap-1">
              <IndianRupee className="h-8 w-8 text-phonepe-primary" />
              <p className="text-5xl font-bold text-phonepe-primary">{details.amount}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-phonepe-primary/10">
                <User className="h-5 w-5 text-phonepe-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Paid to</p>
                <p className="font-semibold text-gray-900">{details.receiverName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-phonepe-primary/10">
                <Phone className="h-5 w-5 text-phonepe-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="font-semibold text-gray-900">{details.receiverPhone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border-2 border-dashed border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <Hash className="mt-0.5 h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="font-mono text-sm font-medium text-gray-900">{details.transactionId}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="text-sm font-medium text-gray-900">{details.timestamp}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 py-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="font-semibold text-green-700">Transaction Completed</p>
          </div>

          <Button
            onClick={onReset}
            className="w-full h-12 bg-gradient-to-r from-phonepe-primary to-phonepe-secondary text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            Make Another Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

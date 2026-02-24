import { Button } from './ui/button';
import { CheckCircle2, User, Phone, IndianRupee, Calendar, Hash, Building2 } from 'lucide-react';
import type { PaymentDetails } from '../pages/PaymentPage';

interface PaymentSuccessProps {
  details: PaymentDetails;
  onReset: () => void;
}

export default function PaymentSuccess({ details, onReset }: PaymentSuccessProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Green background - top 1/3 */}
      <div className="absolute top-0 left-0 right-0 h-[33.333vh] bg-gradient-to-br from-green-500 via-green-600 to-green-700"></div>
      
      {/* White background - bottom 2/3 */}
      <div className="absolute top-[33.333vh] left-0 right-0 bottom-0 bg-white"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 py-8">
        {/* Checkmark circle positioned at the boundary */}
        <div className="mb-8 mt-16 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-white/30"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 className="h-16 w-16 text-green-500 drop-shadow-2xl" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Paid to section - at top of white area */}
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold text-gray-900">Paid to {details.receiverName}</p>
        </div>

        {/* Amount section */}
        <div className="mb-8 w-full max-w-md rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center shadow-md">
          <p className="mb-1 text-sm font-medium text-green-700">Amount Paid</p>
          <div className="flex items-center justify-center gap-1">
            <IndianRupee className="h-8 w-8 text-green-600" />
            <p className="text-5xl font-bold text-green-600">{details.amount}</p>
          </div>
        </div>

        {/* Phone number section */}
        <div className="mb-6 w-full max-w-md rounded-xl bg-gray-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="font-semibold text-gray-900">{details.receiverPhone}</p>
            </div>
          </div>
        </div>

        {/* Sender details section - lower in white area */}
        <div className="mb-6 w-full max-w-md space-y-4 rounded-xl bg-gray-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Paid from</p>
              <p className="font-semibold text-gray-900">Sender Name</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Bank Account</p>
              <p className="font-semibold text-gray-900">HDFC Bank XXXX XXXX 7128</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Hash className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="font-mono text-sm font-medium text-gray-900">{details.transactionId}</p>
            </div>
          </div>
        </div>

        {/* Date & Time section */}
        <div className="mb-6 w-full max-w-md rounded-xl border-2 border-dashed border-gray-200 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Date & Time</p>
              <p className="text-sm font-medium text-gray-900">{details.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Success badge */}
        <div className="mb-6 flex w-full max-w-md items-center justify-center gap-2 rounded-lg bg-green-50 py-3 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="font-semibold text-green-700">Transaction Completed</p>
        </div>

        {/* Action button */}
        <Button
          onClick={onReset}
          className="w-full max-w-md h-12 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          Make Another Payment
        </Button>
      </div>
    </div>
  );
}

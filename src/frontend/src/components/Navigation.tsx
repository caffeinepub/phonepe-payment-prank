import { MessageSquare, CreditCard } from 'lucide-react';

interface NavigationProps {
  activeSection: 'payments' | 'notifications';
  onSectionChange: (section: 'payments' | 'notifications') => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          <button
            onClick={() => onSectionChange('payments')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold transition-all ${
              activeSection === 'payments'
                ? 'text-phonepe-primary border-b-3 border-phonepe-primary bg-phonepe-light/30'
                : 'text-gray-600 hover:text-phonepe-primary hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Payments</span>
          </button>
          <button
            onClick={() => onSectionChange('notifications')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold transition-all ${
              activeSection === 'notifications'
                ? 'text-phonepe-primary border-b-3 border-phonepe-primary bg-phonepe-light/30'
                : 'text-gray-600 hover:text-phonepe-primary hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Notifications</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

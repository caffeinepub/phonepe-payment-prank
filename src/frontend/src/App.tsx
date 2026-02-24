import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import PaymentPage from './pages/PaymentPage';
import NotificationsPage from './pages/NotificationsPage';
import Navigation from './components/Navigation';
import LoginButton from './components/LoginButton';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type Section = 'payments' | 'notifications';

function AppContent() {
  const [activeSection, setActiveSection] = useState<Section>('payments');

  return (
    <div className="min-h-screen bg-gradient-to-br from-phonepe-primary via-phonepe-secondary to-phonepe-accent">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/pe-logo.dim_200x200.png" 
              alt="पे" 
              className="h-10 w-10 rounded-lg"
            />
            <h1 className="text-xl font-bold text-phonepe-primary">PhonePe</h1>
          </div>
          <LoginButton />
        </div>
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      </header>

      <main className="pt-32">
        {activeSection === 'payments' ? (
          <PaymentPage />
        ) : (
          <NotificationsPage />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <InternetIdentityProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </InternetIdentityProvider>
  );
}

export default App;

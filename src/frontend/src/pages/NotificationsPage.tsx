import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import NotificationComposer from '../components/NotificationComposer';
import NotificationInbox from '../components/NotificationInbox';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { Card, CardContent } from '../components/ui/card';
import { LogIn } from 'lucide-react';

export default function NotificationsPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <LogIn className="h-16 w-16 mx-auto text-phonepe-primary mb-4" />
            <h2 className="text-2xl font-bold text-phonepe-primary mb-2">
              Login Required
            </h2>
            <p className="text-gray-600">
              Please login to access notifications and messaging features
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading || loginStatus === 'initializing') {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-12 text-center text-gray-500">
            Loading...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <NotificationComposer />
        <NotificationInbox />
      </div>
    </>
  );
}

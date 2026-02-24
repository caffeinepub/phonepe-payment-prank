import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useGetUserNotifications, useMarkNotificationAsRead } from '../hooks/useNotifications';
import { useGetUserProfile } from '../hooks/useUsers';
import AudioPlayer from './AudioPlayer';
import { Inbox, MessageSquare, Mic, Clock } from 'lucide-react';
import type { Notification } from '../backend';
import { Badge } from './ui/badge';

export default function NotificationInbox() {
  const { data: notifications, isLoading } = useGetUserNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8 text-center text-gray-500">
          Loading notifications...
        </CardContent>
      </Card>
    );
  }

  const sortedNotifications = [...(notifications || [])].sort(
    (a, b) => Number(b.timestamp - a.timestamp)
  );

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-phonepe-primary flex items-center gap-2">
            <Inbox className="h-6 w-6" />
            Notifications
          </CardTitle>
          {notifications && notifications.length > 0 && (
            <Badge variant="secondary" className="bg-phonepe-light text-phonepe-primary">
              {notifications.filter(n => !n.isRead).length} unread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-2">
              You'll see messages from other users here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id.toString()}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const { data: senderProfile } = useGetUserProfile(notification.sender);
  const isAudio = !!notification.audioData;

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        notification.isRead
          ? 'bg-white border-gray-200 hover:border-gray-300'
          : 'bg-phonepe-light/30 border-phonepe-primary/30 hover:border-phonepe-primary/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
          isAudio ? 'bg-purple-100' : 'bg-blue-100'
        }`}>
          {isAudio ? (
            <Mic className="h-5 w-5 text-purple-600" />
          ) : (
            <MessageSquare className="h-5 w-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className={`font-semibold ${!notification.isRead ? 'text-phonepe-primary' : 'text-gray-900'}`}>
              {senderProfile?.name || notification.sender}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
              <Clock className="h-3 w-3" />
              {formatTimestamp(notification.timestamp)}
            </div>
          </div>
          {isAudio ? (
            <div className="mt-2">
              <AudioPlayer externalBlob={notification.audioData} />
            </div>
          ) : (
            <p className="text-gray-700 text-sm break-words">
              {notification.message.__kind__ === 'text' ? notification.message.text : ''}
            </p>
          )}
          {!notification.isRead && (
            <Badge variant="secondary" className="mt-2 bg-phonepe-primary text-white text-xs">
              New
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useSendTextNotification, useSendAudioNotification } from '../hooks/useSendNotification';
import AudioRecorder from './AudioRecorder';
import { MessageSquare, Mic, Loader2, Send } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { Alert, AlertDescription } from './ui/alert';

export default function NotificationComposer() {
  const [messageType, setMessageType] = useState<'text' | 'audio'>('text');
  const [recipientName, setRecipientName] = useState<string>('');
  const [textMessage, setTextMessage] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');

  const sendTextMutation = useSendTextNotification();
  const sendAudioMutation = useSendAudioNotification();

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipientName.trim()) {
      setError('Please enter a recipient name');
      return;
    }

    if (!textMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      await sendTextMutation.mutateAsync({
        recipientId: recipientName.trim(),
        message: textMessage.trim(),
      });

      setTextMessage('');
      setRecipientName('');
    } catch (err: any) {
      setError(err.message || 'Failed to send notification');
    }
  };

  const handleAudioSubmit = async () => {
    setError('');

    if (!recipientName.trim()) {
      setError('Please enter a recipient name');
      return;
    }

    if (!audioBlob) {
      setError('Please record an audio message');
      return;
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const externalBlob = ExternalBlob.fromBytes(uint8Array);

      await sendAudioMutation.mutateAsync({
        recipientId: recipientName.trim(),
        message: 'Audio message',
        audioData: externalBlob,
      });

      setAudioBlob(null);
      setRecipientName('');
    } catch (err: any) {
      setError(err.message || 'Failed to send audio notification');
    }
  };

  const isPending = sendTextMutation.isPending || sendAudioMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-phonepe-primary">
          Send Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {sendTextMutation.isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              Text notification sent successfully!
            </AlertDescription>
          </Alert>
        )}

        {sendAudioMutation.isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              Audio notification sent successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Name</Label>
          <Input
            id="recipient"
            type="text"
            placeholder="Enter recipient name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            disabled={isPending}
          />
        </div>

        <Tabs value={messageType} onValueChange={(v) => setMessageType(v as 'text' | 'audio')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Text Message
            </TabsTrigger>
            <TabsTrigger value="audio" className="gap-2">
              <Mic className="h-4 w-4" />
              Audio Message
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  rows={5}
                  disabled={isPending}
                  className="resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-phonepe-primary to-phonepe-secondary"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Text Message
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <AudioRecorder
              onAudioReady={(blob) => {
                setAudioBlob(blob);
                handleAudioSubmit();
              }}
              disabled={isPending}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

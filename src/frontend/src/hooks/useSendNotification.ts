import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useSendTextNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipientId, message }: { recipientId: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendTextNotification(recipientId, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    },
  });
}

export function useSendAudioNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      recipientId, 
      message, 
      audioData 
    }: { 
      recipientId: string; 
      message: string; 
      audioData: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendAudioNotification(recipientId, message, audioData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    },
  });
}

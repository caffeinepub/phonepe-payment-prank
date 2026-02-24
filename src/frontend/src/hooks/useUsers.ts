import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUserProfile(userId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

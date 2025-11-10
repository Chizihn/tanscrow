// hooks/useUserPresence.ts
import { useQuery, useSubscription, gql } from "@apollo/client";
import { useEffect, useState } from "react";

export const GET_USER_PRESENCE = gql`
  query Query($userId: String!) {
    getUserPresence(userId: $userId)
  }
`;

export const USER_PRESENCE_SUBSCRIPTION = gql`
  subscription UserPresenceChanged($userId: String!) {
    userPresenceChanged(userId: $userId) {
      userPresenceChanged {
        userId
        isOnline
        lastSeen
      }
    }
  }
`;

interface Presence {
  isOnline: boolean;
  lastSeen: string | null;
}

interface SubscriptionData {
  userPresenceChanged: {
    userPresenceChanged: Presence & { userId: string };
  };
}

export function useUserPresence(userId: string | undefined) {
  const [presence, setPresence] = useState<Presence>({
    isOnline: false,
    lastSeen: null,
  });

  // 1. Initial query
  const { data: queryData, loading: queryLoading } = useQuery<{
    getUserPresence: Presence;
  }>(GET_USER_PRESENCE, {
    variables: { userId },
    skip: !userId,
  });

  // 2. Subscription – use `onSubscriptionData`, not `onData`
  useSubscription<SubscriptionData>(USER_PRESENCE_SUBSCRIPTION, {
    variables: { userId },
    skip: !userId,
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) return;

      const payload =
        subscriptionData.data.userPresenceChanged.userPresenceChanged;

      if (payload.userId !== userId) return;

      setPresence({
        isOnline: payload.isOnline,
        lastSeen: payload.lastSeen,
      });
    },
  });

  // 3. Apply initial query result
  useEffect(() => {
    if (queryData?.getUserPresence) {
      setPresence({
        isOnline: queryData.getUserPresence.isOnline,
        lastSeen: queryData.getUserPresence.lastSeen,
      });
    }
  }, [queryData]);

  return { presence, loading: queryLoading };
}

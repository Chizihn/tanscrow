import { API_URL } from "@/constants";
import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, removeAccessToken, removeRefreshToken } from "@/utils/session";
import { REFRESH_TOKEN } from "@/graphql/mutations/auth";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
  Observable,
  FetchResult,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create a simple client for the refresh token request
const tempHttpLink = createHttpLink({
  uri: API_URL,
});

const tempClient = new ApolloClient({
  link: tempHttpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

const refreshTokenLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    let sub: any;
    let retried = false;

    function handleError(error: any) {
      if (
        !retried &&
        error?.graphQLErrors?.some((e: any) => e.extensions?.code === "UNAUTHENTICATED")
      ) {
        retried = true;
        
        // Try to refresh the token using the temp client
        tempClient.mutate({
          mutation: REFRESH_TOKEN,
          variables: { refreshToken: getRefreshToken() },
        })
        .then((result: FetchResult) => {
          const newAccessToken = result.data?.refreshToken?.accessToken;
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            // Retry the original operation with the new token
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            }));
            // Create a new observable for the retry
            const forward$ = forward(operation);
            forward$.subscribe(observer);
          } else {
            removeAccessToken();
            removeRefreshToken();
            observer.error(error);
          }
        })
        .catch((refreshError: any) => {
          removeAccessToken();
          removeRefreshToken();
          observer.error(refreshError);
        });
      } else {
        observer.error(error);
      }
    }

    sub = forward(operation).subscribe({
      next: (result) => observer.next(result),
      error: handleError,
      complete: () => observer.complete(),
    });

    return () => {
      if (sub) sub.unsubscribe();
    };
  });
});

const httpLink = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token as string}` }),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([refreshTokenLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
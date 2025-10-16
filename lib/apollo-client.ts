import { API_URL } from "@/constants";
import { getAccessToken, setAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken } from "@/utils/session";
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
import { GraphQLError } from "graphql";

interface RefreshTokenResponse {
  refreshToken: {
    accessToken: string;
  };
}

// Create a simple client for the refresh token request
const tempHttpLink = createHttpLink({
  uri: API_URL,
});

const tempClient = new ApolloClient({
  link: tempHttpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
    mutate: {
      fetchPolicy: "no-cache",
    },
  },
});

const refreshTokenLink = new ApolloLink((operation, forward) => {
  return new Observable<FetchResult>((observer) => {
    let retried = false;

    function handleError(error: { graphQLErrors?: readonly GraphQLError[] }) {
      if (
        !retried &&
        error?.graphQLErrors?.some((e) => e.extensions?.code === "UNAUTHENTICATED")
      ) {
        retried = true;

        // Try to refresh the token using the temp client
        tempClient
          .mutate<{ refreshToken: { accessToken: string } }>({
            mutation: REFRESH_TOKEN,
            variables: { refreshToken: getRefreshToken() },
          })
          .then((result: FetchResult<RefreshTokenResponse>) => {
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
          .catch((refreshError: Error) => {
            removeAccessToken();
            removeRefreshToken();
            observer.error(refreshError);
          });
      } else {
        observer.error(error);
      }
    }

    const sub = forward(operation).subscribe({
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
      ...(token && { Authorization: `Bearer ${token}` }),
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
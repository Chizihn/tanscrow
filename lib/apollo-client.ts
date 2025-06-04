import { API_URL } from "@/constants";
import { getToken } from "@/utils/session";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const token = getToken();

// 1. HTTP link
const httpLink = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

// 2. Auth link to inject token
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
});

// 3. Combine links
export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
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

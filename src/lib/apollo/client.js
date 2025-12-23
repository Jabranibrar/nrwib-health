import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Simplified cache setup
const cache = new InMemoryCache({
  resultCaching: false,
});

// Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// HTTP Link
const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/graphql`,
  credentials: 'include',
});

// Apollo Client setup
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache
});

export default client;

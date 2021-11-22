import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: `https://flamboyant-lamport-d7a378.netlify.app/.netlify/functions/graphql`,
});

const link = ApolloLink.from([httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

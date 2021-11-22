import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: `http://localhost:8888/.netlify/functions/graphql`,
});

const link = ApolloLink.from([httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./src/graphql/ApolloClient";

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);

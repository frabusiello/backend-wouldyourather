import { ApolloServer, gql } from "apollo-server";

import { schema } from "./schema/schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({ typeDefs: schema, resolvers, tracing: true });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

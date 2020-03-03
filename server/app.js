import { ApolloServer } from "apollo-server";

import { schema } from "./schema/schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
    subscriptions: {
        onConnect: (connectionParams, webSocket, context) => {
            console.log("we have subscribed", context);
            // ...
        },
        onDisconnect: (webSocket, context) => {
            // ...
            console.log("we stopped being subscribed", context);
        }
    },
    typeDefs: schema,
    resolvers,
    tracing: true
});

// The `listen` method launches a web server.
server.listen().then(request => {
    const { url, subscriptionsUrl } = request;
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});

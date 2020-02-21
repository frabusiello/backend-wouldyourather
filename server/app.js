import { ApolloServer, gql } from "apollo-server";
import { getBooks, getRoom } from "./data";
import { schema } from "./schema/schema";
const resolvers = {
    Query: {
        books: () => getBooks(),
        currentRoom: (parent, { roomCode }) => {
            console.log("asdasd", parent, "args,", roomCode);
            return getRoom(roomCode);
        }
        // currentRoom: (parent, args) => {
        //     console.log("args", args);
        //     return {
        //         roomCode: args.roomCode || "abcd",
        //         players: []
        //     };
        // }
        // currentRoom: () => {
        //     return { roomCode: "aaaa", players: [] };
        // }
    }
};
const server = new ApolloServer({ typeDefs: schema, resolvers, tracing: true });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

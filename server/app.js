import { ApolloServer, gql } from "apollo-server";
import {
    getBooks,
    getRoomByCode,
    createRoom,
    getPlayerFromUuid,
    createPlayerAndAddToRoom,
    getRoomFromUuid
} from "./data";
import { schema } from "./schema/schema";
const resolvers = {
    Query: {
        books: () => getBooks(),
        currentRoom: (parent, { roomCode }) => getRoomByCode(roomCode),
        player: (parent, { id }) => getPlayerFromUuid(id)
    },
    Mutation: {
        createRoom,
        createPlayerAndAddToRoom: (parent, { playerName, roomCode }) => {
            return createPlayerAndAddToRoom(playerName, roomCode);
        }
    },
    Player: (parent, { id }) => getPlayerFromUuid(id),
    Room: (parent, { id }) => getRoomFromUuid(id)
};
const server = new ApolloServer({ typeDefs: schema, resolvers, tracing: true });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

const { PubSub } = require("apollo-server");

import {
    getBooks,
    getRoomByCode,
    createRoom,
    getPlayerFromUuid,
    createPlayerAndAddToRoom,
    getRoomFromUuid
} from "./data";

const pubsub = new PubSub();

export const resolvers = {
    Subscription: {
        playerJoined: {
            subscribe: args => {
                console.log("trying to sub", args);
                return pubsub.asyncIterator(["PLAYER_JOINED"]);
            },
            resolve: ({ roomCode }) => {
                console.log("resolving brah", roomCode);
                return getRoomByCode(roomCode);
            }
        }
    },
    Query: {
        currentRoom: (parent, { roomCode }) => getRoomByCode(roomCode),
        player: (parent, { id }) => {
            return getPlayerFromUuid(id);
        }
    },
    Mutation: {
        createRoom,
        createPlayerAndAddToRoom: async (parent, { playerName, roomCode }) => {
            const room = await createPlayerAndAddToRoom(playerName, roomCode);
            pubsub.publish("PLAYER_JOINED", { roomCode });

            return room;
        }
    },
    Player: (parent, args) => {
        console.log("getting player", parent, args);
        return getPlayerFromUuid(args.id);
    },
    Room: {
        players: parent => {
            console.log("parent", parent);
            if (parent.players.length > 0) {
                const playerPromises = parent.players.map(p =>
                    getPlayerFromUuid(p)
                );
                console.log(playerPromises);
                return Promise.all(playerPromises);
            }
        }
    }
};

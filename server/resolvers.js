const { PubSub, withFilter } = require("apollo-server");

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
            subscribe: withFilter(
                () => pubsub.asyncIterator("PLAYER_JOINED"),
                (payload, variables) => {
                    return payload.roomCode === variables.roomCode;
                }
            ),
            // subscribe: args => {
            //     console.log("trying to sub", args);
            //     return pubsub.asyncIterator(["PLAYER_JOINED"]);
            // },
            resolve: ({ player }) => {
                console.log("resolved player", player);
                return player;
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
            const player = await createPlayerAndAddToRoom(playerName, roomCode);
            console.log("player mutation", player);

            pubsub.publish("PLAYER_JOINED", { roomCode, player });

            return player;
        }
    },
    Player: (parent, args) => {
        console.log("getting player", parent, args);
        return getPlayerFromUuid(args.id);
    },
    Room: {
        players: parent => {
            if (parent.players.length > 0) {
                const playerPromises = parent.players.map(p =>
                    getPlayerFromUuid(p)
                );
                return Promise.all(playerPromises);
            }
            return [];
        }
    }
};

import {
    getBooks,
    getRoomByCode,
    createRoom,
    getPlayerFromUuid,
    createPlayerAndAddToRoom,
    getRoomFromUuid
} from "./data";

export const resolvers = {
    Query: {
        books: () => getBooks(),
        currentRoom: (parent, { roomCode }) => getRoomByCode(roomCode),
        player: (parent, { id }) => {
            console.log("adadasd", parent, id);
            return getPlayerFromUuid(id);
        }
    },
    Mutation: {
        createRoom,
        createPlayerAndAddToRoom: (parent, { playerName, roomCode }) => {
            return createPlayerAndAddToRoom(playerName, roomCode);
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

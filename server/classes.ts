import uuidv4 from "uuid/v4";
type dbRoom = {
    roomCode: string;
    currentPlayers: [Player];
    uuid: string;
    gameStatus: string;
};
type dbPlayer = {
    name: string;
    uuid: string;
};

export class Room {
    constructor(room: dbRoom) {
        const { roomCode, currentPlayers, uuid, gameStatus } = room;
        return {
            roomCode,
            players: currentPlayers,
            id: uuid,
            gameStatus
        };
    }
}

export class Player {
    constructor(player: dbPlayer) {
        const { name, uuid } = player;
        return {
            name,
            id: uuid
        };
    }
}

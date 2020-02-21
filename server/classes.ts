import uuidv4 from "uuid/v4";
type dbRoom = {
    roomCode: string;
    currentPlayers: [Player];
};
type Player = {
    name: string;
};
export class Room {
    constructor(room: dbRoom) {
        const { roomCode, currentPlayers } = room;
        return {
            roomCode,
            players: currentPlayers
        };
    }
}

export class dbPlayer {
    constructor(name: string) {
        return {
            name,
            uuid: uuidv4()
        };
    }
}

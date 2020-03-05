import uuidv4 from "uuid/v4";
type dbRoom = {
    roomCode: string;
    players: [Player];
    uuid: string;
    gameStatus: string;
    questions: [string];
};
type dbPlayer = {
    name: string;
    uuid: string;
};
type dbQuestion = {
    uuid: string;
    asker: string;
    responder: string;
    choices: {
        a: string;
        b: string;
    };
    answers: [
        {
            playerId: string;
            choice: string;
        }
    ];
    correct: string;
};

export class Room {
    constructor(room: dbRoom) {
        const { roomCode, players, uuid, gameStatus, questions } = room;
        return {
            roomCode,
            players: players != null ? players : [],
            id: uuid,
            gameStatus,
            questions: questions != null ? questions : []
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

export class Question {
    constructor(question: dbQuestion) {
        return { id: question.uuid, ...question };
    }
}

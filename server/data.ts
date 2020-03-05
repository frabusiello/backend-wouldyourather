import connection from "./mongo";
import uuidv4 from "uuid/v4";
import { Db } from "mongodb";
import { Room, Player, Question } from "./classes";
import { generateRoomCode } from "./utils/roomCodes";
export async function getBooks() {
    const client = await connection();
    return await client
        .collection("books")
        .find()
        .toArray();
}

export async function getRoomByCode(roomCode: string) {
    if (roomCode.length === 0) {
        return {};
    }
    const client = await connection();
    const roomArray = await client
        .collection("rooms")
        .find({ roomCode })
        .toArray();
    if (roomArray.length > 0) {
        return new Room(roomArray[0]);
    } else {
        throw new Error(`Could not get room with roomCode ${roomCode}`);
    }
}

export async function createPlayer(name: string) {
    const uuid = uuidv4();
    const client = await connection();
    const mongoRes = await client
        .collection("players")
        .insertOne({ name, uuid });
    if (mongoRes && mongoRes.result && mongoRes.result.ok === 1) {
        return await getPlayerFromUuid(uuid);
    } else {
        throw new Error(`Couldn't create Player with name ${name}`);
    }
}

export async function getPlayerFromUuid(uuid: string) {
    const client = await connection();
    const playerArray = await client
        .collection("players")
        .find({ uuid })
        .toArray();
    if (playerArray.length > 0) {
        return new Player(playerArray[0]);
    } else {
        throw new Error(`Could not find player with uuid ${uuid}`);
    }
}

export async function getRoomFromUuid(uuid: string) {
    const client = await connection();
    const roomArray = await client
        .collection("rooms")
        .find({ uuid })
        .toArray();
    if (roomArray.length > 0) {
        return new Room(roomArray[0]);
    } else {
        throw new Error(`Could not get room with uuid ${uuid}`);
    }
}
export async function createRoom() {
    const client = await connection();
    const uuid = uuidv4();
    const mongoRes = await client.collection("rooms").insertOne({
        roomCode: generateRoomCode(),
        uuid,
        gameStatus: "waiting",
        players: []
    });
    if (mongoRes && mongoRes.result && mongoRes.result.ok === 1) {
        return await getRoomFromUuid(uuid);
    } else {
        throw new Error("Couldn't create room");
    }
}

export async function addPlayerToRoom(playerId: string, roomCode: string) {
    const client = await connection();
    const room = await getRoomByCode(roomCode);
    if (room.gameStatus != "waiting") {
        throw new Error("Can't add player while game is in progress");
    }
    const player = await getPlayerFromUuid(playerId);
    const mongoRes = await client
        .collection("rooms")
        .updateOne({ uuid: room.id }, { $push: { players: playerId } });
    if (mongoRes && mongoRes.result && mongoRes.result.ok === 1) {
        return await getRoomByCode(roomCode);
    } else {
        throw new Error("Couldn't create room");
    }
}

export async function createPlayerAndAddToRoom(
    playerName: string,
    roomCode: string
) {
    const player = await createPlayer(playerName);
    const room = await addPlayerToRoom(player.id, roomCode);
    return player;
}

type choices = {
    a: string;
    b: string;
};
export async function createQuestion(
    asker: string,
    responder: string,
    choices: choices,
    roomCode: string
) {
    const client = await connection();

    const question = {
        asker,
        responder,
        choices,
        roomCode,
        answers: [],
        uuid: uuidv4(),
        timestamp: Date.now()
    };
    const insertQuestionResponse = await client
        .collection("questions")
        .insertOne(question);
    if (insertQuestionResponse?.result?.ok === 1) {
        const updateRoomResponse = await insertQuestionInRoom(
            roomCode,
            question.uuid
        );
        if (updateRoomResponse?.result?.ok === 1) {
            const updateRoomResponse = await insertQuestionInRoom(
                roomCode,
                question.uuid
            );
        } else {
            throw new Error("Couldn't create room");
        }
    } else {
        throw new Error("Couldn't create room");
    }
}

export async function insertQuestionInRoom(
    roomCode: string,
    questionId: string
) {
    const client = await connection();
    return await client
        .collection("rooms")
        .updateOne({ roomCode }, { $push: { questions: questionId } });
}

export async function answerQuestion(
    questionId: string,
    choice: string,
    playerId: string
) {
    const client = await connection();
    const question = await getQuestionByUuid(questionId);
    if (question.asker === playerId) {
        throw new Error("asker can't answer the question");
    }
    if (question.answers.filter(q => q.playerId === playerId).length > 0) {
        throw new Error("Player has already answered the question");
    }
    const questionRes = await client
        .collection("questions")
        .updateOne(
            { uuid: questionId },
            { $push: { answers: { playerId, choice } } }
        );
    //TODO check if player has already answered the question
    return getQuestionByUuid(questionId);
}

export async function getQuestionByUuid(questionId: string) {
    const client = await connection();
    const questionArray = await client
        .collection("questions")
        .find({ uuid: questionId })
        .toArray();
    return new Question(questionArray[0]);
}

export async function getAllPlayers(playerIds: Array<string>) {
    const client = await connection();
    const players = await client
        .collection("players")
        .find({ uuid: { $in: playerIds } })
        .toArray();
    return players.map(p => new Player(p));
}
export async function getAllQuestions(questionIds: Array<string>) {
    const client = await connection();
    const questions = await client
        .collection("questions")
        .find({ uuid: { $in: questionIds } })
        .toArray();
    return questions.map(q => new Question(q));
}

export async function startGame(roomCode: string) {
    const client = await connection();
    await client
        .collection("rooms")
        .updateOne({ roomCode }, { $set: { gameStatus: "in progress" } });
    return getRoomByCode(roomCode);
}

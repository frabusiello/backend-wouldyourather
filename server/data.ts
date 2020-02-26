import connection from "./mongo";
import uuidv4 from "uuid/v4";
import { Db } from "mongodb";
import { Room, Player } from "./classes";
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
    console.log("getting room", roomCode);
    const client = await connection();
    const roomArray = await client
        .collection("rooms")
        .find({ roomCode })
        .toArray();
    console.log("roomArray", roomArray.length);
    if (roomArray.length > 0) {
        console.log("here", roomArray[0]);
        return new Room(roomArray[0]);
    } else {
        console.log("roomCoooode,", roomCode);
        throw new Error(`Could not get room with roomCode ${roomCode}`);
    }
}

export async function createPlayer(name: string) {
    console.log("creating player", name);
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
    console.log("getting player by uuid", uuid);
    const client = await connection();
    const playerArray = await client
        .collection("players")
        .find({ uuid })
        .toArray();
    if (playerArray.length > 0) {
        console.log("here", playerArray[0]);
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
    console.log("roomArray", roomArray.length);
    if (roomArray.length > 0) {
        console.log("here", roomArray[0]);
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
        gameStatus: "waiting"
    });
    // console.log("room", room);
    if (mongoRes && mongoRes.result && mongoRes.result.ok === 1) {
        return await getRoomFromUuid(uuid);
    } else {
        throw new Error("Couldn't create room");
    }
}

export async function addPlayerToRoom(playerId: string, roomCode: string) {
    console.log("playerId", playerId, roomCode);
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
        return await getRoomFromUuid(room.id);
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
    return room;
}

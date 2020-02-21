import connection from "./mongo";
import { Db } from "mongodb";
import { Room, dbPlayer } from "./classes";

export async function getBooks() {
    const client = await connection();
    return await client
        .collection("books")
        .find()
        .toArray();
}

export async function getRoom(roomCode: string) {
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
    }
    return {};
}

export async function createPlayer(name: string) {
    console.log("creating player", name);
    const client = await connection();
    const insertedPlayer = await client
        .collection("players")
        .insertOne(new dbPlayer(name));
    return insertedPlayer;
}

// export async function addPlayerToRoom({ playerId: string }) {}

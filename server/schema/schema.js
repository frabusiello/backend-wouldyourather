import { gql } from "apollo-server";

export const schema = gql`
    type Book {
        title: String
        author: String
    }

    type Room {
        gameStatus: String
        roomCode: String
        players: [Player]
        id: ID!
    }

    type Player {
        name: String
        id: ID!
    }
    type Query {
        books: [Book]
        currentRoom(roomCode: String): Room
        player(id: String): Player
    }

    type Mutation {
        createRoom: Room
        createPlayerAndAddToRoom(playerName: String, roomCode: String): Room
    }
`;

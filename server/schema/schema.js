import { gql } from "apollo-server";

export const schema = gql`
    type Book {
        title: String
        author: String
    }

    type Room {
        roomCode: String
        players: [Player]
    }

    type Player {
        name: String
    }

    type Query {
        books: [Book]
        currentRoom(roomCode: String): Room
    }
`;

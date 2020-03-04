import { gql } from "apollo-server";

export const schema = gql`
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
        currentRoom(roomCode: String): Room
        player(id: String): Player
    }

    type Mutation {
        createRoom: Room
        createPlayerAndAddToRoom(playerName: String, roomCode: String): Player
    }
    type Subscription {
        playerJoined(roomCode: String): Player
    }
`;

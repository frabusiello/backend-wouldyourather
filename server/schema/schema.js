import { gql } from "apollo-server";

export const schema = gql`
    type Room {
        gameStatus: String
        roomCode: String
        players: [Player]
        id: ID!
        currentQuestion: Question
        questions: [Question]
    }

    type Player {
        name: String
        id: ID!
    }
    type Query {
        currentRoom(roomCode: String): Room
        player(id: String): Player
    }
    type Choices {
        a: String
        b: String
    }
    type Question {
        id: ID!
        asker: Player
        responder: Player
        choices: Choices
        answers: [Answer]
        correct: String
    }
    type Answer {
        player: Player
        answer: String
    }
    input ChoiceInput {
        a: String
        b: String
    }
    type Mutation {
        createRoom: Room
        createPlayerAndAddToRoom(playerName: String, roomCode: String): Player
        askQuestion(
            asker: String
            responder: String
            choices: ChoiceInput
            roomCode: String
        ): Question
        startGame(roomCode: String): Room
        answerQuestion(
            questionId: String
            choice: String
            playerId: String
        ): Question
    }
    type Subscription {
        playerJoined(roomCode: String): Player
    }
`;

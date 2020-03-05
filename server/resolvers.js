const { PubSub, withFilter } = require("apollo-server");

import {
    getBooks,
    getRoomByCode,
    createRoom,
    getPlayerFromUuid,
    createPlayerAndAddToRoom,
    getRoomFromUuid,
    createQuestion,
    getAllPlayers,
    getAllQuestions,
    startGame,
    answerQuestion
} from "./data";

const pubsub = new PubSub();

export const resolvers = {
    Subscription: {
        playerJoined: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("PLAYER_JOINED"),
                (payload, variables) => {
                    return payload.roomCode === variables.roomCode;
                }
            ),
            // subscribe: args => {
            //     console.log("trying to sub", args);
            //     return pubsub.asyncIterator(["PLAYER_JOINED"]);
            // },
            resolve: ({ player }) => {
                console.log("resolved player", player);
                return player;
            }
        }
    },
    Query: {
        currentRoom: (parent, { roomCode }) => getRoomByCode(roomCode),
        player: (parent, { id }) => {
            return getPlayerFromUuid(id);
        }
    },
    Mutation: {
        createRoom,
        createPlayerAndAddToRoom: async (parent, { playerName, roomCode }) => {
            const player = await createPlayerAndAddToRoom(playerName, roomCode);

            pubsub.publish("PLAYER_JOINED", { roomCode, player });

            return player;
        },
        askQuestion: async (
            parent,
            { asker, responder, choices, roomCode }
        ) => {
            const question = await createQuestion(
                asker,
                responder,
                choices,
                roomCode
            );

            pubsub.publish("QUESTION_ASKED", { roomCode });

            return question;
        },
        startGame: async (parent, { roomCode }) => {
            const room = await startGame(roomCode);
            pubsub.publish("GAME_STARTED", { roomCode });

            return room;
        },
        answerQuestion: async (parent, { questionId, choice, playerId }) => {
            const question = await answerQuestion(questionId, choice, playerId);
            pubsub.publish("QUESTION_ANSWERED", { questionId });
            return question;
        }
    },
    Player: (parent, args) => {
        return getPlayerFromUuid(args.id);
    },
    Question: {
        asker: parent => {
            return getPlayerFromUuid(parent.asker);
        },
        responder: parent => {
            return getPlayerFromUuid(parent.responder);
        }
    },
    Room: {
        players: parent => {
            if (parent.players.length > 0) {
                return getAllPlayers(parent.players);
            }
            return [];
        },
        currentQuestion: parent => {
            if (parent.questions.length === 0) {
                return {};
            }
        },
        questions: parent => {
            if (parent.questions.length > 0) {
                return getAllQuestions(parent.questions);
            }
            return [];
        }
    }
};

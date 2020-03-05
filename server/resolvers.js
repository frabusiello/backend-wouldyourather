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

            resolve: ({ player }) => {
                console.log("resolved player", player);
                return player;
            }
        },
        gameStatus: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("GAME_STATUS_CHANGED"),
                (payload, variables) => {
                    console.log("asdasdasdasdad", payload, variables);
                    return payload.roomCode === variables.roomCode;
                }
            ),

            resolve: ({ room }) => {
                console.log("resolved room", room);
                return room;
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
            pubsub.publish("GAME_STATUS_CHANGED", { roomCode, room });

            return room;
        },
        answerQuestion: async (parent, { questionId, choice, playerId }) => {
            const question = await answerQuestion(questionId, choice, playerId);
            // if (question.answers.length === parent.players.length - 1) {
            //     console.lof("we have parity", question.answers, parent.players);
            // }
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
        },
        correct: parent => {
            const responderAnswer = parent.answers.filter(
                a => a.playerId === parent.responder
            );
            return responderAnswer?.[0]?.choice;
        },
        answers: async function(parent) {
            const answers = await parent.answers.map(({ playerId, choice }) => {
                const player = getPlayerFromUuid(playerId);
                return { player, answer: choice };
            });
            return answers;
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
        },
        scores: parent => {
            parent.questions.forEach(q => {
                console.log("q", q);
            });
        }
    }
};

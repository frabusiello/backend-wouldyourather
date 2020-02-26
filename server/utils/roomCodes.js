import randomstring from "randomstring";
export const generateRoomCode = () => {
    return randomstring.generate({
        length: 4,
        readable: true,
        capitalization: "lowercase"
    });
};

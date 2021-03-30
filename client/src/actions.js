export function privateMessages(msgs) {
    return {
        type: "PRIVATE_MESSAGES",

        msgs,
    };
}
export function privateMessage(msg) {
    return {
        type: "PRIVATE_MESSAGE",

        msg,
    };
}

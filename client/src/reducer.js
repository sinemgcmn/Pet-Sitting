export default function (state = {}, action) {
    // series of IF statements....

    if (action.type == "PRIVATE_MESSAGES") {
        console.log("private put in state", action.msgs);
        state = {
            ...state,
            private_messages: action.msgs,
        };

        return state;
    }
    if (action.type == "PRIVATE_MESSAGE") {
        state = {
            ...state,
            private_messages: [...state.private_messages, action.msg],
        };

        return state;
    }
    console.log("state", state);
    return state;
}

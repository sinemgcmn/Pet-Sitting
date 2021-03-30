import { privateMessages, privateMessage } from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("privateMessages", (msgs) => {
            console.log("private messages came", msgs);
            store.dispatch(privateMessages(msgs));
        });

        socket.on("privateMessage", (msg) => {
            console.log("private message came", msg);
            store.dispatch(privateMessage(msg));
        });
    }
};

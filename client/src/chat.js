import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export function Chat() {
    const privateMessages = useSelector((state) => state && state.messages);
    console.log("privateMessages", privateMessages);

    const elemRef = useRef();

    useEffect(() => {
        // console.log("chat mounted...");
        // console.log("elemRef.current", elemRef.current);
        // console.log("elemRef.current.scrollTop:", elemRef.current.scrollTop);
        // console.log("scrollHeight", elemRef.current.scrollHeight);
        // console.log("clientHeight", elemRef.current.clientHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privateMessages]);

    const keyCheck = (e) => {
        //only really care about the value, when i press unter
        console.log("e.target.value:", e.target.value);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("e.target.value:", e.target.value);
            socket.emit("privateMessages", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <>
            <h1 className="mostRecentHeadline">
                We discuss feeding schedule & organization here
            </h1>
            <h3 className="chatHeadline">
                Please do not post anything other than feeding schedule &
                organization topic.
            </h3>

            <div className="chat-container" ref={elemRef}>
                {privateMessages &&
                    privateMessages.map((privateMessage, i) => {
                        console.log("i", i);
                        return (
                            <div key={i}>
                                <p className="chatName">
                                    {privateMessage.first_name}{" "}
                                    {privateMessage.last_name}
                                </p>
                                <p> {privateMessage.info}</p>
                            </div>
                        );
                    })}
            </div>
            <h1 className="mostRecentHeadline">Shoot your message here!</h1>

            <textarea className="chat-text" onKeyDown={keyCheck}></textarea>
        </>
    );
}

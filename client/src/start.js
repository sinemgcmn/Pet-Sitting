import ReactDOM from "react-dom";
import { io } from "socket.io-client";
const socket = io.connect();
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import Welcome from "./welcome";
import Footer from "./footer";
import Header from "./header";
import App from "./app";

import { init } from "./socket";
let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
ReactDOM.render(<Footer />, document.querySelector("footer"));
ReactDOM.render(<Header />, document.querySelector("header"));

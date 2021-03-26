import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Footer from "./footer";
import Header from "./header";
import App from "./app";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
ReactDOM.render(<Footer />, document.querySelector("footer"));
ReactDOM.render(<Header />, document.querySelector("header"));

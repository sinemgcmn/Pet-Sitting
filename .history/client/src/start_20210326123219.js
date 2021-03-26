import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <p>my main page of website</p>;
}

ReactDOM.render(elem, document.querySelector("main"));

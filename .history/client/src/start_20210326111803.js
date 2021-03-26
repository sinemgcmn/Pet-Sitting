import ReactDOM from "react-dom";
import Welcome from "./welcome";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

function HelloWorld() {
    return <div>Hello, World!</div>;
}

import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
// import Login from "./login";
// import Reset from "./reset";

export default function Welcome() {
    return (
        <div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    {/* <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} /> */}
                </div>
            </HashRouter>
        </div>
    );
}

import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "axios";
import Family from "./family";
import Sitter from "./sitter";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            id: "",
        };
        console.log("props in App: ", props);
    }

    componentDidMount() {
        axios
            .get("/")
            .then(({ data }) => {
                console.log("app", data);
                if (data.success[0]) {
                    this.setState({
                        first: data.success[0].first_name,
                        last: data.success[0].last_name,
                        id: data.success[0].id,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios GET/ user:", err);
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    (
                    <div>
                        <Route
                            exact
                            path="/family"
                            render={() => (
                                <Family
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/sitter"
                            render={() => (
                                <Sitter
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                />
                            )}
                        />
                    </div>
                    )
                </div>
            </BrowserRouter>
        );
    }
}

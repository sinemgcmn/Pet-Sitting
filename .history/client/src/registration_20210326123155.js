import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleClick() {
        // console.log("clicked!!!");
        axios.post("/registration", this.state);
        // .then(({ data }) => {
        //     // if (everything went according to plan - no errors!) {
        //         // redirect
        //         location.replace('/');
        //     } else {
        //         // render an error message
        //         this.setState({
        //             error: true
        //         });
        //     }
        // })
        // .catch((err) => {
        //     console.log("err in axios POST /registration: ", err);
        // });
    }

    handleChange(e) {
        // console.log("change is running!");
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            // this callback runs after setState finishes updating state
            // because we're logging state here in the callback, this means this
            // log won't run until state has been updated, ensuring us that
            // we're seeing the most updated log
            () => console.log("this.state after setState: ", this.state)
        );

        // console.log("this.state after setState: ", this.state);
    }

    render() {
        return (
            <div>
                <h1>Registration</h1>
                {this.state.error && <p>something went wrong :(</p>}
                <input
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.handleClick()}>submit!</button>
            </div>
        );
    }
}

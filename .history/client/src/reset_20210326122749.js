import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            step: 1,
        };
    }

    handleReset() {
        axios
            .post("/reset/start", this.state)
            .then(({ data }) => {
                // console.log("data:", data);
                if (data.success) {
                    this.setState({ step: 2 });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios POST/ registration:", err);
            });
    }

    handleVerify() {
        axios
            .post("/reset/verify", this.state)
            .then(({ data }) => {
                console.log("data:", data);
                if (data.success) {
                    // console.log("I am from reset verify");
                    this.setState({ step: 3 });
                } else if (data.success === false) {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios POST/ registration:", err);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this state after setState:", this.state)
        );
    }

    render() {
        const { step } = this.state;
        return (
            <div>
                {this.state.error && (
                    <h2 className="errorMsg">
                        Sorry, something went wrong.Please check your
                        information!
                    </h2>
                )}
                {step == 1 && (
                    <div className="userForm">
                        <input
                            className="regInputs"
                            name="email"
                            placeholder="email"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button
                            className="regButton"
                            onClick={() => this.handleReset()}
                        >
                            Reset Password
                        </button>
                    </div>
                )}
                {step == 2 && (
                    <div className="userForm">
                        <input
                            className="regInputs"
                            name="code"
                            placeholder="security code"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <input
                            className="regInputs"
                            name="password"
                            placeholder="password"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button
                            className="regButton"
                            onClick={() => this.handleVerify()}
                        >
                            Submit
                        </button>
                    </div>
                )}
                {step == 3 && (
                    <div>
                        <h1>We succesfully changed your password!</h1>
                        <Link className="loginMsg" to="/login">
                            You can now log in with your new password!
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}

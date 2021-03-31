import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default class Registration extends React.Component {
    // class component
    constructor() {
        super();
        this.state = {
            place: "",
            status: "sitter",
            error: false,
            editModeIsOn: false,
            flag: false,
            lat: 0,
            lonn: 0,
        };
    }

    componentDidUpdate() {
        if (this.state.address != undefined && !this.state.flag) {
            fetch(
                "https://nominatim.openstreetmap.org/search?q=" +
                    this.state.address +
                    "&limit=1&format=json"
            )
                .then((res) => res.json())
                .then((data) => {
                    this.state.flag = true;
                    console.log(data);
                    this.setState({
                        place: data[0].display_name,
                        lat: data[0].lat,
                        lon: data[0].lon,
                    });
                });
        }
    }

    handleClick() {
        // console.log("clicked!");

        axios
            .post("/registration", this.state)
            .then(({ data }) => {
                console.log("data:", data);
                if (data.success === true) {
                    if (data.user_status) {
                        location.replace("/family");
                    } else {
                        location.replace("/");
                    }
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
        return (
            <div>
                <Helmet>
                    <link rel="stylesheet" href="registration.css" />
                </Helmet>
                <h1 className="headReg headReg-reg">
                    Find a Loving and Local Pet Sitter
                </h1>
                <h3 className="bottomReg bottomReg-reg">
                    who treats your pet like family...
                </h3>
                <video
                    id="videoMV"
                    poster="backgroundpic.jpeg"
                    autoPlay
                    muted
                    loop
                >
                    <source src="/dog.mp4" type="video/mp4" />
                </video>
                {this.state.error && (
                    <h2 className="errorMsg">
                        Sorry, something went wrong.Please check your
                        information!
                    </h2>
                )}
                {this.state.status == "sitter" && (
                    <div className="userForm">
                        <select
                            className="regInputs"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.value}
                            name="status"
                            defaultValue={"DEFAULT"}
                        >
                            <option value="DEFAULT">
                                {" "}
                                -- select an option --{" "}
                            </option>

                            <option value="family">Pet Family</option>
                            <option value="sitter">Become a Sitter</option>
                        </select>

                        <input
                            className="regInputs"
                            name="address"
                            placeholder="address"
                            onChange={(e) => this.handleChange(e)} // binding the changes/ not to get undefined
                        />

                        <input
                            className="regInputs"
                            name="first"
                            placeholder="first"
                            onChange={(e) => this.handleChange(e)} // binding the changes/ not to get undefined
                        />
                        <input
                            className="regInputs"
                            name="last"
                            placeholder="last"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <input
                            className="regInputs"
                            name="email"
                            placeholder="email"
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
                            onClick={() => this.handleClick()}
                        >
                            Register
                        </button>
                    </div>
                )}
                {this.state.status != "sitter" && (
                    <div className="userForm">
                        <select
                            className="regInputs"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.value}
                            name="status"
                            defaultValue={"DEFAULT"}
                        >
                            <option value="DEFAULT">
                                {" "}
                                -- select an option --{" "}
                            </option>

                            <option value="family">Pet Family</option>
                            <option value="sitter">Become a Sitter</option>
                        </select>

                        <input
                            className="regInputs"
                            name="first"
                            placeholder="first"
                            onChange={(e) => this.handleChange(e)} // binding the changes/ not to get undefined
                        />
                        <input
                            className="regInputs"
                            name="last"
                            placeholder="last"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <input
                            className="regInputs"
                            name="email"
                            placeholder="email"
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
                            onClick={() => this.handleClick()}
                        >
                            Register
                        </button>
                    </div>
                )}
                <Link className="loginMsg" to="/login">
                    Already registered?
                </Link>
            </div>
        );
    }
}

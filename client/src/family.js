import React from "react";
import axios from "./axios";

export default class Family extends React.Component {
    // class component
    constructor() {
        super(); // this must be written where there is a constructor.
        this.state = {
            error: false,
            place: [],
        }; // a sthis has a parent constructor, we should bind the data wirth 'this'.
    }

    // componentDidMount() {
    //     // console.log("grandchild just mounted");
    //     // console.log("props in grandchild", this.props);
    //     if (this.props.bio) {
    //         this.setState({
    //             btnTxt: "edit",
    //         });
    //     } else {
    //         this.setState({
    //             btnTxt: "add",
    //         });
    //     }
    // }

    handleClick() {
        console.log("this.state.place", this.state.place);
        fetch(
            "https://nominatim.openstreetmap.org/search?q=" +
                this.state.place +
                "&limit=1&format=json"
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.setState({ place: data });
            });
        axios.post("/search", { place: this.state.place }).then(({ data }) => {
            if (data.success == true) {
                location.replace("/search");
            }
            console.log("family is workingggg");
        });
    }

    handleChange(e) {
        this.setState(
            {
                place: e.target.value,
            },

            () => console.log("this state after setState:", this.state.place)
        );
    }

    render() {
        return (
            <div>
                <h1 className="headReg">Find a Loving and Local Pet Sitter</h1>
                <h3 className="bottomReg">
                    who treats your pet like family...
                </h3>
                <div className="userForm">
                    <input
                        className="regInputs"
                        name="email"
                        placeholder="search place"
                        onChange={(e) => this.handleChange(e)}
                    />

                    <button onClick={() => this.handleClick()}>Search</button>
                </div>
            </div>
        );
    }
}

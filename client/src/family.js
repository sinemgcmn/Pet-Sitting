import React from "react";
import axios from "./axios";
import Search from "./search";
// import { OpenStreetMapProvider } from "leaflet-geosearch";

// const provider = new OpenStreetMapProvider();

// const input = document.querySelector("input");
// input.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const results = await provider.search({ query: this.state.place });
//     console.log(results);
// });

export default class Family extends React.Component {
    constructor() {
        super(); // this must be written where there is a constructor.
        this.state = {
            error: false,
            place: "",
            total: [],
            sitters: [],
        }; // a sthis has a parent constructor, we should bind the data wirth 'this'.
    }

    handleClick() {
        fetch(
            "https://nominatim.openstreetmap.org/search?q=" +
                this.state.place +
                "&limit=1&format=json"
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.setState({ total: data });
            });
        axios.get("/api/search").then((result) => {
            console.log("family is workingggg", result.data.success);
            this.setState({ sitters: result.data.success });
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
            <>
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
                    <button onClick={() => this.handleClick()}>search</button>
                </div>
                <Search sitters={this.state.sitters} total={this.state.total} />
            </>
        );
    }
}

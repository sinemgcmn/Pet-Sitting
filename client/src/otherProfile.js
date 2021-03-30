import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: "",
        };
    }

    componentDidMount() {
        console.log("this.props.match:", this.props.match);
        console.log("the id is:", this.props.match.params.id);

        axios
            .post("/otherSitters", { id: this.props.match.params.id })
            .then(({ data }) => {
                if (data.success == false) {
                    this.props.history.push("/");
                } else {
                    console.log("datafromotherprofile:", data);

                    this.setState({ userInfo: data.success[0] });
                }
            })
            .catch(function (err) {
                console.log("error from post req", err);
            });
    }

    render() {
        return (
            <div className="searchRecent">
                <div className="mostRecentOtherProfile">
                    <div className="otherProfile">
                        <h1>
                            {this.state.userInfo.first_name}{" "}
                            {this.state.userInfo.last_name}
                        </h1>
                        <img
                            className="mostRecentImg"
                            src={this.state.userInfo.imageurl}
                            alt={`${
                                this.state.userInfo.first_name +
                                this.state.userInfo.last_name
                            }`}
                        />
                        <a href="/chat">
                            {" "}
                            Click here to contact with{" "}
                            {this.state.userInfo.first_name}{" "}
                        </a>

                        <h1>About {this.state.userInfo.first_name}</h1>
                        {this.state.userInfo.bio}
                        <h1>{this.state.userInfo.first_name}'s Home</h1>
                        {this.state.userInfo.home}
                        <h1>Accepted Pets</h1>
                        {this.state.userInfo.pet}
                        <h1>{this.state.userInfo.first_name}'s Skills</h1>
                        {this.state.userInfo.skills}
                        {/* <FriendButton id={this.props.match.params.id} /> */}
                    </div>
                </div>
            </div>
        );
    }
}

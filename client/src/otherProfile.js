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
                        <img
                            className="mostRecentImg"
                            src={this.state.userInfo.imageurl}
                            alt={`${
                                this.state.userInfo.first_name +
                                this.state.userInfo.last_name
                            }`}
                        />
                        <h1 className="mostRecentHeadlineOtherProfile">
                            {this.state.userInfo.first_name}{" "}
                            {this.state.userInfo.last_name}
                            {this.state.userInfo.bio}
                            {this.state.userInfo.home}
                            {this.state.userInfo.pet}
                            {this.state.userInfo.skills}
                        </h1>

                        {/* <FriendButton id={this.props.match.params.id} /> */}
                    </div>
                    <h1 className="otherBio">{this.state.userInfo.bio}</h1>
                </div>
            </div>
        );
    }
}

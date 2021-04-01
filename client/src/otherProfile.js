import { Component } from "react";
import axios from "./axios";
import { Helmet } from "react-helmet";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            userInfo: "",
        };
    }

    componentDidMount() {
        console.log("this.props.match:", this.props.match);
        console.log("the id is:", this.props.match.params.id);

        axios
            .post("/otherSitters", {
                id: this.props.match.params.id,
                value: this.state.value,
            })
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

    updateRate() {
        axios
            .post("/rateUpdate", {
                id: this.props.match.params.id,
                value: this.state.value,
            })
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

    handleChange(e) {
        this.setState(
            {
                value: e.target.value,
            },

            () => console.log("this state after setState:", this.state)
        );
    }

    render() {
        return (
            <div>
                <Helmet>
                    <link rel="stylesheet" href="/other.css" />
                </Helmet>
                <div className="searchRecent">
                    <div className="mostRecentOtherProfile">
                        <div className="otherProfile">
                            <div className="user-info">
                                <h1>
                                    {this.state.userInfo.first_name}{" "}
                                    {this.state.userInfo.last_name}
                                </h1>
                                <div className="rating present">
                                    <label className="full">
                                        {" "}
                                        {this.state.userInfo.rate}
                                    </label>
                                </div>
                                <h3 onClick={() => this.props.chatVisible()}>
                                    {" "}
                                    Click here to contact with{" "}
                                    {this.state.userInfo.first_name}{" "}
                                </h3>
                            </div>

                            <div className="info-block">
                                <img
                                    className="mostRecentImg"
                                    src={this.state.userInfo.imageurl}
                                    alt={`${
                                        this.state.userInfo.first_name +
                                        this.state.userInfo.last_name
                                    }`}
                                />

                                <div className="block">
                                    <h2>
                                        About {this.state.userInfo.first_name}
                                    </h2>
                                    {this.state.userInfo.bio}
                                </div>
                                <div className="block">
                                    <h2>
                                        {this.state.userInfo.first_name}'s
                                        Services
                                    </h2>
                                    {this.state.userInfo.services}
                                </div>
                                <div className=" block">
                                    <h2>
                                        {this.state.userInfo.first_name}'s Home
                                    </h2>
                                    {this.state.userInfo.home}
                                </div>
                                <div className="block">
                                    <h2>Accepted Pets</h2>
                                    {this.state.userInfo.pet}
                                </div>
                                <div className="block">
                                    {" "}
                                    <h2>
                                        {this.state.userInfo.first_name}'s
                                        Skills
                                    </h2>
                                    {this.state.userInfo.skills}
                                </div>
                            </div>
                            {/* <FriendButton id={this.props.match.params.id} /> */}
                        </div>
                    </div>
                </div>
                <div>
                    <fieldset className="rating">
                        <input
                            type="radio"
                            id="star5"
                            name="rating"
                            value="5"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="full"
                            htmlFor="star5"
                            title="Awesome - 5 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star4half"
                            name="rating"
                            value="4.5"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="half"
                            htmlFor="star4half"
                            title="Pretty good - 4.5 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star4"
                            name="rating"
                            value="4"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="full"
                            htmlFor="star4"
                            title="Pretty good - 4 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star3half"
                            name="rating"
                            value="3.5"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="half"
                            htmlFor="star3half"
                            title="Meh - 3.5 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star3"
                            name="rating"
                            value="3"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="full"
                            htmlFor="star3"
                            title="Meh - 3 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star2half"
                            name="rating"
                            value="2.5"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="half"
                            htmlFor="star2half"
                            title="Kinda bad - 2.5 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star2"
                            name="rating"
                            value="2"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="full"
                            htmlFor="star2"
                            title="Kinda bad - 2 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star1half"
                            name="rating"
                            value="1.5"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="half"
                            htmlFor="star1half"
                            title="Meh - 1.5 stars"
                        ></label>
                        <input
                            type="radio"
                            id="star1"
                            name="rating"
                            value="1"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="full"
                            htmlFor="star1"
                            title="Sucks big time - 1 star"
                        ></label>
                        <input
                            type="radio"
                            id="starhalf"
                            name="rating"
                            value="0.5"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label
                            className="half"
                            htmlFor="starhalf"
                            title="Sucks big time - 0.5 stars"
                        ></label>
                    </fieldset>
                    <button
                        className="rateButton"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.updateRate()}
                    >
                        Rate Me!
                    </button>
                </div>
            </div>
        );
    }
}

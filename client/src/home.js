import axios from "./axios";
import React from "react";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homeDraft: "",
            btnTxt: "",
            editModeIsOn: false,
        };
        // console.log("props in BioEditor: ", props);
    }

    componentDidMount() {
        // console.log("grandchild just mounted");
        // console.log("props in grandchild", this.props);
        if (this.props.home) {
            this.setState({
                btnTxt: "edit",
            });
        } else {
            this.setState({
                btnTxt: "add",
            });
        }
    }

    updateHomeinEditor() {
        console.log("this.state.homeDraft", this.state.homeDraft);
        axios
            .post("/home", { homeDraft: this.state.homeDraft })
            .then(({ data }) => {
                console.log("datafromupdateHomeinEditor:", data[0].home);
                let homeUpdated = data[0].home;
                console.log("homeUpdated", homeUpdated);
                console.log("this.props", this.props);
                this.props.updateHome(homeUpdated);

                this.setState({
                    editModeIsOn: false,
                });
            })
            .catch(function (err) {
                console.log("error from post req", err);
            });
    }

    handleChange(e) {
        this.setState(
            {
                homeDraft: e.target.value,
            },
            () => console.log("this state after setState:", this.state)
        );
    }

    toggleHomeEditor() {
        this.setState({
            editModeIsOn: !this.state.editModeIsOn,
        });
    }

    render() {
        return (
            <>
                <div className="block">
                    <h2>{this.props.first}'s Home</h2>

                    {!this.state.editModeIsOn && (
                        <button
                            onClick={() => this.toggleHomeEditor()}
                            onChange={(e) => this.handleChange(e)}
                            className="friendButtonProfile "
                        >
                            {this.state.btnTxt}
                        </button>
                    )}

                    {this.state.editModeIsOn && (
                        <div>
                            <textarea
                                onChange={(e) => this.handleChange(e)}
                                defaultValue={this.props.home}
                            />

                            <button
                                className="friendButtonProfile "
                                onChange={(e) => this.handleChange(e)}
                                onClick={() => this.updateHomeinEditor()}
                            >
                                Save
                            </button>
                        </div>
                    )}
                    <p>{this.props.home}</p>
                </div>
            </>
        );
    }
}

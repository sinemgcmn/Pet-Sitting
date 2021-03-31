import axios from "./axios";
import React from "react";

export default class Service extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serDraft: "",
            btnTxt: "",
            editModeIsOn: false,
        };
        console.log("props in service: ", props);
    }

    componentDidMount() {
        // console.log("grandchild just mounted");
        console.log("props in grandchild", this.props);
        if (this.props.services) {
            this.setState({
                btnTxt: "edit",
            });
        } else {
            this.setState({
                btnTxt: "add",
            });
        }
    }

    updateServicesInEditor() {
        console.log("this.state.serDraft", this.state.serDraft);
        axios
            .post("/service", { serDraft: this.state.serDraft })
            .then(({ data }) => {
                console.log("datafromupdateservice:", data[0].services);
                let serviceUpdated = data[0].services;
                console.log("serviceUpdated", serviceUpdated);
                console.log("this.props", this.props);
                this.props.updateService(serviceUpdated);

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
                serDraft: e.target.value,
            },
            () => console.log("this state after setState:", this.state)
        );
    }

    toggleServiceEditor() {
        this.setState({
            editModeIsOn: !this.state.editModeIsOn,
        });
    }

    render() {
        return (
            <>
                <div className="block">
                    <h2>{this.props.first}'s services</h2>

                    {!this.state.editModeIsOn && (
                        <button
                            onClick={() => this.toggleServiceEditor()}
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
                                defaultValue={this.props.services}
                            />
                            <button
                                className="friendButtonProfile "
                                onChange={(e) => this.handleChange(e)}
                                onClick={() => this.updateServicesInEditor()}
                            >
                                Save
                            </button>
                        </div>
                    )}
                    <h3>At {this.props.first}'s home</h3>
                    <p>{this.props.services}</p>
                    <h3>At your home</h3>
                    <p>{this.props.services}</p>
                </div>
            </>
        );
    }
}

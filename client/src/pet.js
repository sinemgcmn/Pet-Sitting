import axios from "./axios";
import React from "react";

export default class Pet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            petDraft: "",
            btnTxt: "",
            editModeIsOn: false,
        };
        // console.log("props in BioEditor: ", props);
    }

    componentDidMount() {
        // console.log("grandchild just mounted");
        // console.log("props in grandchild", this.props);
        if (this.props.pet) {
            this.setState({
                btnTxt: "edit",
            });
        } else {
            this.setState({
                btnTxt: "add",
            });
        }
    }

    updatePetInEditor() {
        console.log("this.state.petDraft", this.state.petDraft);
        axios
            .post("/pet", { petDraft: this.state.petDraft })
            .then(({ data }) => {
                console.log("datafromupdatePetinEditor:", data[0].pet);
                let petUpdated = data[0].pet;
                console.log("petUpdated", petUpdated);
                console.log("this.props", this.props);
                this.props.updatePet(petUpdated);

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
                petDraft: e.target.value,
            },
            () => console.log("this state after setState:", this.state)
        );
    }

    togglePetEditor() {
        this.setState({
            editModeIsOn: !this.state.editModeIsOn,
        });
    }

    render() {
        return (
            <>
                <h1>Accepted Pets</h1>
                <p>{this.props.pet}</p>

                {!this.state.editModeIsOn && (
                    <button
                        onClick={() => this.togglePetEditor()}
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
                            defaultValue={this.props.pet}
                        />
                        <button
                            className="friendButtonProfile "
                            onChange={(e) => this.handleChange(e)}
                            onClick={() => this.updatePetInEditor()}
                        >
                            Save
                        </button>
                    </div>
                )}
            </>
        );
    }
}

import axios from "./axios";
import React from "react";

export default class Skills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skillsDraft: "",
            btnTxt: "",
            editModeIsOn: false,
        };
        console.log("props in SkillEditor: ", props);
    }

    componentDidMount() {
        // console.log("grandchild just mounted");
        // console.log("props in grandchild", this.props);
        if (this.props.skills) {
            this.setState({
                btnTxt: "edit",
            });
        } else {
            this.setState({
                btnTxt: "add",
            });
        }
    }

    updateSkillInEditor() {
        console.log("this.state.skills", this.state.skills);
        axios
            .post("/skills", { skillsDraft: this.state.skillsDraft })
            .then(({ data }) => {
                console.log("datafromupdateSkillInEditor:", data[0].skills);
                let skillsUpdated = data[0].skills;
                console.log("skillsUpdated", skillsUpdated);
                console.log("this.props", this.props);
                this.props.updateSkills(skillsUpdated);

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
                skillsDraft: e.target.value,
            },
            () => console.log("this state after setState:", this.state)
        );
    }

    toggleSkillsEditor() {
        this.setState({
            editModeIsOn: !this.state.editModeIsOn,
        });
    }

    render() {
        return (
            <>
                <h1> {this.props.first}'s Skills</h1>
                <p>{this.props.skills}</p>

                {!this.state.editModeIsOn && (
                    <button
                        onClick={() => this.toggleSkillsEditor()}
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
                            defaultValue={this.props.bio}
                        />
                        <button
                            className="friendButtonProfile "
                            onChange={(e) => this.handleChange(e)}
                            onClick={() => this.updateSkillInEditor()}
                        >
                            Save
                        </button>
                    </div>
                )}
            </>
        );
    }
}

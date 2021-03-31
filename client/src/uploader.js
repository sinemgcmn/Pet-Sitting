import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        console.log("props in Uploader: ", props);
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }

    updateImgUrlUploader() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("datafromuploader:", data);

                this.props.updateImgUrlApp(data.imageurl);
                this.props.toggleUploader();
            })

            .catch(function (err) {
                console.log("error from post req", err);
            });
    }

    toggleUploaderMod() {
        this.props.toggleUploader();
    }

    render() {
        return (
            <div className="uploader-popup">
                <div className="uploader-text">
                    <p
                        className="popup-close-button"
                        onClick={() => this.toggleUploaderMod()}
                    >
                        X
                    </p>
                    <p>Want to change your image?</p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <button
                        className="regButton"
                        onClick={(e) => this.updateImgUrlUploader(e)}
                    >
                        Upload
                    </button>
                </div>
            </div>
        );
    }
}

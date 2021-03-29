import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import Family from "./family";
import Sitter from "./sitter";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Search from "./search";

// Geocode.setApiKey("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            place: null,
            first: "",
            last: "",
            imageUrl: "",
            bio: "",
            services: "",
            home: "",
            skills: "",
            pet: "",
            id: "",
            uploaderIsVisible: false,
            isRequestEnded: false,
        };
    }

    componentDidMount() {
        axios
            .get("/sitter")
            .then(({ data }) => {
                console.log("app", data);
                if (data.success[0]) {
                    this.setState({
                        first: data.success[0].first_name,
                        last: data.success[0].last_name,
                        imageUrl: data.success[0].imageurl,
                        bio: data.success[0].bio,
                        services: data.success[0].services,
                        home: data.success[0].home,
                        skills: data.success[0].skills,
                        pet: data.success[0].pet,
                        id: data.success[0].id,
                        isRequestEnded: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios GET/ user:", err);
                this.setState({
                    isRequestEnded: true,
                });
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updateImgUrlApp(imageUrl) {
        console.log("Im running in App!!! and my argument is: ", imageUrl);
        this.setState({ imageUrl: imageUrl });
    }

    updateBio(bio) {
        // console.log(arguments);
        // console.log("bio", bio);
        this.setState({ bio: bio });
    }

    updateService(services) {
        this.setState({ services: services });
    }

    updateHome(home) {
        this.setState({ home: home });
    }

    updateSkills(skills) {
        this.setState({ skills: skills });
    }

    updatePet(pet) {
        // console.log("Im running in App!!! and my argument is: ", pet);
        this.setState({ pet: pet });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <div>
                        {this.state.isRequestEnded && (
                            <div>
                                <Presentational
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    toggleUploader={() => this.toggleUploader()}
                                />
                                <Route
                                    exact
                                    path="/"
                                    render={() => (
                                        <Sitter
                                            id={this.state.id}
                                            first={this.state.first}
                                            last={this.state.last}
                                            imageUrl={this.state.imageUrl}
                                            toggleUploader={() =>
                                                this.toggleUploader()
                                            }
                                            bio={this.state.bio}
                                            services={this.state.services}
                                            home={this.state.home}
                                            skills={this.state.skills}
                                            pet={this.state.pet}
                                            updateBio={(bio) =>
                                                this.updateBio(bio)
                                            }
                                            updateService={(services) =>
                                                this.updateService(services)
                                            }
                                            updateHome={(home) =>
                                                this.updateHome(home)
                                            }
                                            updateSkills={(skills) =>
                                                this.updateSkills(skills)
                                            }
                                            updatePet={(pet) =>
                                                this.updatePet(pet)
                                            }
                                        />
                                    )}
                                />
                                <Route path="/family" component={Family} />
                                <Route path="/search" component={Search} />
                            </div>
                        )}

                        {this.state.uploaderIsVisible && (
                            <Uploader
                                updateImgUrlApp={(imageUrl) =>
                                    this.updateImgUrlApp(imageUrl)
                                }
                                toggleUploader={() => this.toggleUploader()}
                            />
                        )}
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

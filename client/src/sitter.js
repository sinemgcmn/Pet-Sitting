import BioEditor from "./bioEditor";
import Presentational from "./presentational";
import Service from "./service";
import Home from "./home";
import Skills from "./skills";
import Pet from "./pet";

export default function Sitter(props) {
    console.log("props in Sitter:", props);
    return (
        <>
            <div className="mostRecentProfile">
                <div className="searchProfile">
                    <h1 className="mostRecentHeadlineProfile">
                        {props.first} {props.last}{" "}
                    </h1>
                    <Presentational
                        imageUrl={props.imageUrl}
                        toggleUploader={props.toggleUploader}
                    />
                    <BioEditor
                        first={props.first}
                        last={props.last}
                        bio={props.bio}
                        updateBio={(bio) => props.updateBio(bio)}
                    />
                    <Service
                        first={props.first}
                        last={props.last}
                        services={props.services}
                        updateService={(services) =>
                            props.updateService(services)
                        }
                    />
                    <Home
                        first={props.first}
                        last={props.last}
                        home={props.home}
                        updateHome={(home) => props.updateHome(home)}
                    />
                    <Skills
                        first={props.first}
                        last={props.last}
                        skills={props.skills}
                        updateSkills={(skills) => props.updateSkills(skills)}
                    />
                    <Pet
                        first={props.first}
                        last={props.last}
                        pet={props.pet}
                        updatePet={(pet) => props.updatePet(pet)}
                    />
                </div>
            </div>
        </>
    );
}

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default class Search extends React.Component {
    // class component
    constructor(props) {
        super(props); // this must be written where there is a constructor.
        this.state = {
            currentLocation: { lat: 52.52, lng: 13.405 },
            zoom: 13,

            // a sthis has a parent constructor, we should bind the data wirth 'this'.
        };
        console.log("deneme", props);
    }

    render() {
        return (
            <div>
                <MapContainer
                    center={this.state.currentLocation}
                    zoom={this.state.zoom}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[-74.0060152, 40.7127281]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                    <Marker position={[52.52, 13.405]}>
                        <Popup>Bizim.</Popup>
                    </Marker>
                </MapContainer>
            </div>
        );
    }
}

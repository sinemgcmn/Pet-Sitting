import { Link } from "react-router-dom";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default class Search extends React.Component {
    // class component
    constructor(props) {
        super(props); // this must be written where there is a constructor.
        this.state = {
            currentLocation: [52.52, 13.405],
            zoom: 13,
        };
    }

    render() {
        console.log("hazal->>", this.props.sitters);
        console.log("sinem->>", this.props.total);
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

                    {this.getUsers().map((user, index) => (
                        <Marker
                            key={index}
                            position={[`${user.lat}`, `${user.lon}`]}
                        >
                            <Popup>
                                {user.first_name}
                                {user.last_name}

                                <Link to={`/sitter/${user.id}`}>
                                    <img
                                        className="searchPic"
                                        src={user.imageurl}
                                    />
                                </Link>
                                <p>About {user.first_name}🐶🐱😻</p>
                                {user.bio}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        );
    }

    getUsers() {
        var users = [];
        for (var i = 0; i < this.props.sitters.length; i++) {
            if (this.checkDistance(this.props.sitters[i])) {
                users.push(this.props.sitters[i]);
            }
        }
        return users;
    }

    checkDistance(user) {
        // return distance in meters
        var c = 0;
        if (this.props.total.length > 0) {
            var lon1 = this.toRadian(this.props.total[0].lon),
                lat1 = this.toRadian(this.props.total[0].lat),
                lon2 = this.toRadian(user.lon),
                lat2 = this.toRadian(user.lat);

            var deltaLat = lat2 - lat1;
            var deltaLon = lon2 - lon1;

            var a =
                Math.pow(Math.sin(deltaLat / 2), 2) +
                Math.cos(lat1) *
                    Math.cos(lat2) *
                    Math.pow(Math.sin(deltaLon / 2), 2);
            c = 2 * Math.asin(Math.sqrt(a));
            var EARTH_RADIUS = 6371;
        }
        if (10000 >= c * EARTH_RADIUS * 1000) {
            return true;
        }
        return false;
    }
    toRadian(degree) {
        return (degree * Math.PI) / 180;
    }
}

// var distance = getDistance([lat1, lng1], [lat2, lng2]);

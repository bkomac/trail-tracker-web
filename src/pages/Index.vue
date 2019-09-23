<template>
<div>
    <g-map :name="mapName"></g-map>
</div>
</template>

<script>
/* eslint-disable */
import {
    store
} from "../store/store.js";
export default {
    name: "Index",
    props: ["name"],

    data() {
        return {
            mapName: "tracking-map",
            map: null,
            socket: this.$socket,
            users: store.users,
            store: store
        };
    },
    mounted() {
        console.log("mounted...");
        const element = document.getElementById(this.mapName);
        const options = {
            zoom: 16,
            center: new google.maps.LatLng(46.0676, 14.4116)
        };
        this.map = new google.maps.Map(element, options);

        this.socket.on("locations", this.onLocation);

        // var marker = new google.maps.Marker({
        //     position: {
        //         lat: 46.0676,
        //         lng: 14.4116
        //     },
        //     map: this.map,
        //     draggable: true,
        //     animation: google.maps.Animation.DROP
        // });
    },
    created() {},
    methods: {
        onLocation(locations) {
            console.log(
                "onLocation... for user " + locations[0].user.name,
                locations
            );
            locations = locations || [];
            for (var element in locations) {
                //if (lastLocations.hasOwnProperty(prop)) {

                var loc = locations[element];
                console.log("loc ", loc);

                if (this.users[loc.user.uuid] == undefined) {
                     console.log("adding user: ", loc.user.name);
                    var user = {
                        name: loc.user.name,
                        uuid: loc.user.uuid,
                        position: loc
                    };
                    var u = {};
                    u[loc.user.uuid] = user;
                    //this.store.addUser(u);
                    //this.users[loc.user.uuid]=user;
                    this.$set(this.users, loc.user.uuid, user)
                    this.store.sync();
                }

                try {
                    this.users[loc.user.uuid].lastMarker.setMap(null);
                } catch (e) {}

                this.users[loc.user.uuid].lastMarker = this.addLastMarker(loc, this.map);
                // this.users[loc.user.uuid].lastMarker = this.addLastMarker(
                //   loc,
                //  this.map
                // );
                this.map.setCenter({
                    lat: loc.lat,
                    lng: loc.lon
                });
            }
        },
        addLastMarker(location, map) {
            var title = new Date(location.time).toString(); //moment(new Date(location.time)).fromNow();

            var marker = new google.maps.Marker({
                position: {
                    lat: location.lat,
                    lng: location.lon
                },
                map: map,
                draggable: true,
                color: "#00ff00",
                title: title,
                label: location.user.name.substring(0, 1) || "",
                animation: google.maps.Animation.DROP
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<div id="content">' +
                    '<div id="siteNotice">' +
                    title +
                    "</div>" +
                    '<h2 id="firstHeading" class="firstHeading">Last location, ' +
                    location.user.name +
                    "</h2>" +
                    '<div id="bodyContent">' +
                    "<p><b>Activity type:</b> " +
                    location.activity.type +
                    " (" +
                    location.activity.confidence +
                    "%)</p>" +
                    "<p><b>Speed:</b> " +
                    location.speed +
                    " km/h</p>" +
                    "<p><b>Altitude:</b> " +
                    location.altitude +
                    " m</p>" +
                    "<p><b>Battery level:</b> " +
                    location.battery.level +
                    "%</p>" +
                    "<p><b>Last seen:</b> " +
                    new Date(location.time) +
                    "</p>" +
                    "</div>" +
                    "</div>"
            });

            var int = setInterval(function () {
                title = new Date(location.time);
                //console.log(title);
                marker.set("title", title);

                infowindow = new google.maps.InfoWindow({
                    content: '<div id="content">' +
                        '<div id="siteNotice">' +
                        title +
                        "</div>" +
                        '<h2 id="firstHeading" class="firstHeading">Last location, ' +
                        location.user.name +
                        "</h2>" +
                        '<div id="bodyContent">' +
                        "<p><b>Activity type:</b> " +
                        location.activity.type +
                        " (" +
                        location.activity.confidence +
                        "%)</p>" +
                        "<p><b>Speed:</b> " +
                        location.speed +
                        " km/h</p>" +
                        "<p><b>Altitude:</b> " +
                        location.altitude +
                        " m</p>" +
                        "<p><b>Battery level:</b> " +
                        location.battery.level +
                        "%</p>" +
                        "<p><b>Last seen:</b> " +
                        new Date(location.time) +
                        "</p>" +
                        "</div>" +
                        "</div>"
                });

                marker.addListener("click", function () {
                    infowindow.open(map, marker);
                });
            }, 10000);

            marker.addListener("click", function () {
                infowindow.open(map, marker);
            });

            return marker;
        }
    }
};

class User {
    name = null;
    uuid = null;
    markers = [];
    lastMarker = {};

    constructor() {}
}
</script>
<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#map {
  height: 100%;
}

#content {
  width: 250px;
}
</style

<template>
  <q-page>
    <g-map :name="mapName"></g-map>
  </q-page>
</template>

<script>
/* eslint-disable */
import { store } from "../store/store.js";
export default {
  name: "Index",
  props: ["name"],

  data() {
    return {
      mapName: "tracking-map",
      map: null,
      socket: this.$socket,

      store: store,
      lastMarkers: {},
      accurracyMarkers: {}
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
        var loc = locations[element];
        console.log("loc ", loc);

        if (
          this.store.users[loc.user.uuid] == undefined ||
          this.store.users[loc.user.uuid] == null
        ) {
          console.log("adding user: ", loc.user.name);
          var user = {
            name: loc.user.name,
            uuid: loc.user.uuid,
            position: loc
          };

          this.$set(this.store.users, loc.user.uuid, user);
        } else {
          console.log("adding position to user: ", loc.user.name);
          this.$set(this.store.users[loc.user.uuid], 'position', loc);
        }
        try {
          this.lastMarkers[loc.user.uuid].setMap(null);
          this.accurracyMarkers[loc.user.uuid].setMap(null);
        } catch (e) {
          console.log("err:" + e.message);
        }
        this.lastMarkers[loc.user.uuid] = this.addLastMarker(loc, this.map);
        this.store.users[loc.user.uuid].lastMarker = this.lastMarkers[
          loc.user.uuid
        ];
        this.accurracyMarkers[loc.user.uuid] = this.addAccuracyMarker(
          loc,
          this.map
        );
        if (this.store.users[loc.user.uuid].locations == undefined)
          this.store.users[loc.user.uuid].locations = [];
        this.store.users[loc.user.uuid].locations.push({
          lat: loc.lat,
          lng: loc.lon
        });

        if (this.store.userToFollow == loc.user.uuid) {
          this.map.panTo({
            lat: loc.lat,
            lng: loc.lon
          });
        }
      } //---
    },
    addLastMarker(location, map) {
      var title = this.$moment(location.time).fromNow();

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
        content:
          '<div id="content">' +
          '<div id="siteNotice">' +
          title +
          "</div>" +
          '<h5 id="firstHeading" class="firstHeading">Last location, ' +
          location.user.name +
          "</h5>" +
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
          this.$moment(location.time).fromNow() +
          "</p>" +
          "</div>" +
          "</div>"
      });

      var self = this;
      var int = setInterval(function() {
        title = self.$moment(location.time).fromNow();
        //console.log(title);
        marker.set("title", title);

        infowindow = new google.maps.InfoWindow({
          content:
            '<div id="content">' +
            '<div id="siteNotice">' +
            title +
            "</div>" +
            '<h5 id="firstHeading" class="firstHeading">Last location, ' +
            location.user.name +
            "</h5>" +
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
            self.$moment(location.time).fromNow() +
            "</p>" +
            "</div>" +
            "</div>"
        });

        marker.addListener("click", function() {
          infowindow.open(map, marker);
        });
      }, 10000);

      marker.addListener("click", function() {
        infowindow.open(map, marker);
      });

      return marker;
    },

    addAccuracyMarker(location, map) {
      var marker = new google.maps.Circle({
        center: { lat: location.lat, lng: location.lon },
        radius: location.accuracy,
        map: map,
        fillColor: "#00f",
        fillOpacity: 0.03,
        strokeColor: "#00f",
        strokeOpacity: 0.09,
        strokeWeight: 1
      });
      return marker;
    }
  }
};

class User {
  name = null;
  uuid = null;
  locations = [];
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

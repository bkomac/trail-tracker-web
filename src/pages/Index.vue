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
      channel: store.channel,
      store: store,
      lastMarkers: {},
      accurracyMarkers: {},
      timers: {}
    };
  },
  watch: {
    channel: function(value) {
      if (value != undefined || value != "") {
        channel = value + "/";
        this.socket.on(channel + "locations", this.onLocation);
        console.log("connecting to channel " + channel);
      }
    }
  },
  mounted() {
    console.log("mounted...");
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 16,
      center: new google.maps.LatLng(46.0676, 14.4116)
    };
    this.map = new google.maps.Map(element, options);
    this.socket.on("location", this.onLocation);

    if (this.channel != undefined || this.channel != "") {
      var channel = channel + "/";
      this.socket.on(channel + "location", this.onLocation);
    } else {
      this.socket.on("location", this.onLocation);
    }

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
    onLocation(loc) {
      console.log(new Date() + " onLocation... for user " + loc.user.name, loc);

      if (
        this.store.users[loc.user.uuid] == undefined ||
        this.store.users[loc.user.uuid] == null
      ) {
        console.log("adding user: ", loc.user.name);
        var user = {
          name: loc.user.name,
          uuid: loc.user.uuid,
          position: loc.data,
          pointNum: loc.pointNum
        };

        this.$set(this.store.users, loc.user.uuid, user);
      } else {
        console.log("adding position to user: ", loc.user.name);
        this.$set(this.store.users[loc.user.uuid], "position", loc.data);
        this.$set(this.store.users[loc.user.uuid], "pointNum", loc.pointNum);
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
      this.store.users[loc.user.uuid].locations.push(loc);
      this.store.users[loc.user.uuid].locations = this.store.users[
        loc.user.uuid
      ].locations.slice(-10);

      if (this.store.userToFollow == loc.user.uuid) {
        this.map.panTo({
          lat: loc.data.lat,
          lng: loc.data.lon
        });
      }

      if (this.timers[loc.user.uuid] != undefined)
        clearTimeout(this.timers[loc.user.uuid]);

      this.store.users[loc.user.uuid].moment = this.$moment(
        loc.data.time
      ).fromNow();

      this.timers[loc.user.uuid] = this.setMomentTimer(this, loc.user.uuid);
    },

    setMomentTimer(self, uuid) {
      return setInterval(function() {
        self.store.users[uuid].moment = self
          .$moment(self.store.users[uuid].position.time)
          .fromNow();

        self.$set(
          self.store.users[uuid],
          "moment",
          self.$moment(self.store.users[uuid].position.time).fromNow()
        );
        // console.log(
        //   "moment of " +
        //     uuid +
        //     ": " +
        //     self.store.users[uuid].moment
        // );
      }, 10000);
    },

    addLastMarker(location, map) {
      var title = this.$moment(location.data.time).fromNow();

      var marker = new google.maps.Marker({
        position: {
          lat: location.data.lat,
          lng: location.data.lon
        },
        map: map,
        draggable: true,
        color: "#ff0000",
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
          location.data.act.type +
          " (" +
          location.data.act.confidence +
          "%)</p>" +
          "<p><b>Speed:</b> " +
          location.data.spd +
          " km/h</p>" +
          "<p><b>Altitude:</b> " +
          location.data.alt +
          " m</p>" +
          "<p><b>Battery level:</b> " +
          location.data.batt.level +
          "%</p>" +
          "<p><b>Last seen:</b> " +
          this.$moment(location.data.time).fromNow() +
          "</p>" +
          "</div>" +
          "</div>"
      });

      var self = this;
      var int = setInterval(function() {
        title = self.$moment(location.data.time).fromNow();
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
            location.data.act.type +
            " (" +
            location.data.act.confidence +
            "%)</p>" +
            "<p><b>Speed:</b> " +
            location.data.spd +
            " km/h</p>" +
            "<p><b>Altitude:</b> " +
            location.data.alt +
            " m</p>" +
            "<p><b>Battery level:</b> " +
            location.data.batt.level +
            "%</p>" +
            "<p><b>Last seen:</b> " +
            self.$moment(location.data.time).fromNow() +
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
        center: { lat: location.data.lat, lng: location.data.lon },
        radius: location.data.acc,
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

.map-icon-label .map-icon {
  font-size: 24px;
  color: #ffffff;
  line-height: 48px;
  text-align: center;
  white-space: nowrap;
}
</style

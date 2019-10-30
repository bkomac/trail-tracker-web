<template>
  <q-drawer
    side="right"
    v-model="localRightDrawerOpen"
    overlay
    show-if-above
    bordered
    :width="370"
    :breakpoint="500"
    content-class="bg-grey-3"
  >
    <q-scroll-area class="fit">
      <q-list class="rounded-borders" style="max-width: 500px" separator>
        <q-item-label header>Online trackers</q-item-label>
        <q-separator />
        <q-item
          v-bind:key="user.uuid"
          v-for="user in store.users"
          @click="centerMap(user)"
          clickable
        >
          <q-item-section avatar>
            <q-avatar>
              <img
                :src="'https://ui-avatars.com/api/?background='+user.color+'&color=fff&name='+user.name"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{user.name}}</q-item-label>
            <q-item-label caption lines="2" v-show="user.position.alt">
              <span class="text-weight-bold">Altitude: {{user.position.alt | toFixed1}}m</span>
            </q-item-label>
            <q-item-label caption lines="2" v-show="user.position.acc">
              <span class="text-weight-bold">Accuracy: {{user.position.acc | toFixed}}m</span>
            </q-item-label>
            <q-item-label caption lines="2" v-show="user.position.spd">
              <span class="text-weight-bold">Speed: {{user.position.spd | toKmH | toFixed1 }} km/h</span>
            </q-item-label>
            <q-item-label caption lines="2" v-show="user.position.hr">
              <span class="text-weight-bold">HR: {{user.position.hr}} bpm</span>
            </q-item-label>
            <q-item-label caption lines="2" v-show="user.position.batt">
              <span class="text-weight-bold">Battery: {{user.position.batt.level}}%</span>
              <transition name="fade">
                <div style="width: 150px">
                  <q-linear-progress
                    rounded
                    style="height: 20px"
                    :value="user.position.batt.level / 100"
                    color="red"
                    class="q-mt-sm"
                  />
                </div>
              </transition>
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <transition name="fade">
              <q-item-label caption :title="new Date(user.position.time)">{{user.moment}}</q-item-label>
            </transition>
            <q-badge
              v-if="user.action != 'stop'"
              :title="user.position.act.confidence + '%'"
              :label="user.position.act.type | stripUnderscore"
              style="margin: 2px"
            />
            <q-badge v-else color="red" label="LOGGING STOPED" style="margin: 2px" />
            <q-badge :label="user.pointNum" style="margin: 2px" />
            <transition name="fade">
              <q-badge
                v-show="store.userToFollow == user.uuid"
                color="green"
                label="FOLLOWING"
                style="margin: 2px"
              />
            </transition>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
/* eslint-disable */
import { store } from "../store/store.js";

export default {
  name: "RightMenu",
  props: {
    /* this prop gets passed down from our parent - it should NOT be manipulated directly! */
    rightDrawerOpen: Boolean
  },
  data() {
    return {
      store: store,
      localRightDrawerOpen: true
    };
  },
  methods: {
    centerMap(user) {
      console.log("key:", user);

      var savedLocations =
        JSON.parse(localStorage.getItem("savedLocations")) || {};
      savedLocations[user.uuid] = {
        name: user.name,
        uuid: user.uuid,
        loc: user.position
      };

      localStorage.setItem("savedLocations", JSON.stringify(savedLocations));

      user.lastMarker.map.panTo({
        lat: user.position.lat,
        lng: user.position.lon
      });

      store.userToFollow = user.uuid;
      this.$forceUpdate();
    }
  },
  watch: {
    /* If our prop ever gets changed outside of this component then we need to update our local data version of the prop */
    rightDrawerOpen: function(newVal) {
      this.localRightDrawerOpen = newVal;
    }
  },
  mounted: function() {
    /* As soon as the component is mounted convert our passed prop into data*/
    /* This line may or may not be necessary - The watch function probably covers it already, but I haven't tested without it yet */
    this.localRightDrawerOpen = this.rightDrawerOpen;

    this.$root.$on("update", text => {
      console.log("** on event: " + text);
      this.$forceUpdate();
    });
  },
  filters: {
    toFixed(value) {
      if (value != null) return value.toFixed(0);
      else return value;
    },
    toFixed1(value) {
      if (value != null) return value.toFixed(1);
      else return value;
    },
    toFixed2(value) {
      if (value != null) return value.toFixed(2);
      else return value;
    },
    toKmH(value) {
      if (value != null) return value + 3.6;
      else return value;
    },
    stripUnderscore(value) {
      if (value != null) return value.replace("_", " ");
      else return value;
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

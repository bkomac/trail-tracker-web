<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawer = !leftDrawer" icon="menu" aria-label="Menu" />
        <q-toolbar-title>Trail tracker</q-toolbar-title>

        <q-input
          dark
          dense
          standout
          v-model="channel"
          input-class="text-left"
          label="Input channel"
        ></q-input>

        <q-btn v-if="channel != ''" round color="primary" icon="send" @click="connectChannel" />

        <div>TrailTracker v{{ $q.version }}</div>
        <q-btn flat @click="rightDrawerOpen = !rightDrawerOpen" round dense icon="menu" />
      </q-toolbar>
    </q-header>

    <q-drawer :width="200" v-model="leftDrawer" bordered content-class="bg-grey-2">
      <q-list>
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="map" />
          </q-item-section>
          <q-item-section>Map view</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable to="/settings">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </q-drawer>

    <right-menu :right-drawer-open="rightDrawerOpen"></right-menu>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable */
import { store } from "../store/store.js";
export default {
  name: "MyLayout",
  data() {
    return {
      channel: store.channel,
      store: store,
      leftDrawer: false,
      rightDrawerOpen: true
    };
  },
  methods: {
    connectChannel() {
      this.$set(this.store, "channel", this.channel);
    }
  }
};
</script>

<style>
</style>

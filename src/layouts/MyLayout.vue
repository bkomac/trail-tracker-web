<template>
<q-layout view="hHh Lpr lFf">
    <q-header elevated>
        <q-toolbar>
            <q-btn flat dense round @click="leftDrawer = !leftDrawer" icon="menu" aria-label="Menu" />
            <q-toolbar-title>
                Trail tracker
            </q-toolbar-title>
            <div>TrailTracker v{{ $q.version }}</div>
            <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
        </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawer" bordered content-class="bg-grey-2">
        <q-list>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="map" />
              </q-item-section>
              <q-item-section>
              Map view
              </q-item-section>
            </q-item>
           <q-separator />
           <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>
              Settings
              </q-item-section>
            </q-item>
            <q-separator />
        </q-list>
    </q-drawer>

    <q-drawer side="right" v-model="drawerRight" overlay show-if-above bordered :width="300" :breakpoint="500" content-class="bg-grey-3">
        <q-scroll-area class="fit">
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
        <router-view />
    </q-page-container>
</q-layout>
</template>

<script>
/* eslint-disable */
export default {
    name: 'MyLayout',
    data() {
        return {
            leftDrawer: false,
            drawerRight: true
        }
    }
}
</script>
<style>

</style>
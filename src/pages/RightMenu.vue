<template>
    <q-drawer side="right" v-model="localRightDrawerOpen" overlay show-if-above bordered :width="300" :breakpoint="500" content-class="bg-grey-3">
        <q-scroll-area class="fit">

            <q-list bordered class="rounded-borders" style="max-width: 350px">
                <q-item-label header>Online trackers</q-item-label>

                <q-item v-bind:key="user.uuid" v-for="user in users" clickable v-ripple>
                    <q-item-section avatar>
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/img/avatar1.jpg">
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label lines="1">{{user.name}}</q-item-label>
                        <q-item-label caption lines="2">
                            altitude: {{user.position.altitude}}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        1 min ago
                    </q-item-section>
                    <q-separator inset="item" />
                </q-item>
            </q-list>
        </q-scroll-area>
    </q-drawer>
</template>

<script>
/* eslint-disable */
import {store} from "../store/store.js";
export default {
    name: 'RightMenu',
     props: {
        /* this prop gets passed down from our parent - it should NOT be manipulated directly! */
        rightDrawerOpen: Boolean
    },
    data() {
        return {
            users: store.users,
            localRightDrawerOpen: true
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

    }
}
</script>

<style>

</style>

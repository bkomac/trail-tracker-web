<template>
<div class="google-map" :id="mapName"></div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'GMap',
    props: ['name'],
    data: function () {
        return {
            mapName: this.name,
        }
    }
};
</script>

<style scoped>
.google-map {
    width: 100%;
    height: calc(100vh - 50px);
    margin: 0 auto;
    background: gray;
    position: none;
}
</style>

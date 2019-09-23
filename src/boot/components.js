/* eslint-disable */
// import something here
import Gmap from 'components/GMap.vue'
import RightMenu from 'pages/RightMenu.vue'

// "async" is optional
export default async ({ Vue }) => {
  // something to do
  Vue.component('GMap', Gmap);
  Vue.component('RightMenu', RightMenu);
}

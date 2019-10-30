/* eslint-disable */
// import something here
import io from 'socket.io-client';
// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$socket = await io('http://node.komac.si:30000');
  Vue.prototype.$utils = {};
  Vue.prototype.$utils.userColor = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  };
  
}

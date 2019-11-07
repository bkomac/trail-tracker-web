/* eslint-disable */
// import something here
import io from 'socket.io-client';

// "async" is optional
export default async ({ Vue }) => {
  console.log("*** connecting to socket: " + process.env.SOCKET_URL);
  Vue.prototype.$socket = await io(process.env.SOCKET_URL);

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
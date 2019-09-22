/* eslint-disable */
// import something here
import io from 'socket.io-client';
// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$socket = await io('http://node.komac.si:30000');
}

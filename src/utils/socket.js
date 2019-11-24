import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import config from '../config'

export const connectSocket = async () => {
  if (config['socket-host']) {
    Vue.use(new VueSocketIO({
      debug: false,
      connection: config['socket-host']
    }))
  }
}

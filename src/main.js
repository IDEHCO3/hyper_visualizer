// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App';
import Leaflet from 'leaflet';
import 'Leaflet.Coordinates/dist/Leaflet.Coordinates-0.1.5.css';
import 'Leaflet.Coordinates/dist/Leaflet.Coordinates-0.1.5.min.js';
import('../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(Leaflet);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

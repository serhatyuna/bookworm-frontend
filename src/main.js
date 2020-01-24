import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VModal from 'vue-js-modal';
import VueTimeago from 'vue-timeago';
import App from './App.vue';
import router from './router';
import http from './services/http';
import store from './store';
import './assets/css/tailwind.css';

const VueCookie = require('vue-cookie');

Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale
});
Vue.use(VueCookie);
Vue.use(Vuelidate);
Vue.use(VModal);
Vue.prototype.$http = http;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

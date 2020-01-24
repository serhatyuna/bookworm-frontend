import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const getDefaultState = () => ({
  token: '',
  user: {},
});

export default new Vuex.Store({
  strict: true,
  state: getDefaultState(),
  getters: {
    getToken: state => state.token,
    getUser: state => state.user,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    RESET: (state) => {
      Object.assign(state, getDefaultState());
    },
    UPDATE_HTTP_AUTH() {
      Vue.prototype.$http.defaults.headers.common.Authorization = this.getters.getToken;
    },
  },
  actions: {
    logUserIn({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.post('auth/login', payload)
          .then((response) => {
            const { token } = response.data;
            const { user } = response.data;
            commit('SET_TOKEN', token);
            commit('SET_USER', user);
            commit('UPDATE_HTTP_AUTH');
            Vue.cookie.set('token', token, { expires: '8h' });
            resolve(response);
          })
          .catch((error) => {
            Vue.cookie.delete('token');
            reject(error);
          });
      });
    },
    registerUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.post('auth/register', payload)
          .then((response) => {
            const { token } = response.data;
            const { user } = response.data;
            commit('SET_TOKEN', token);
            commit('SET_USER', user);
            commit('UPDATE_HTTP_AUTH');
            Vue.cookie.set('token', token, { expires: '8h' });
            resolve(response);
          })
          .catch((error) => {
            Vue.cookie.delete('token');
            reject(error);
          });
      });
    },
    logUserOut: ({ commit }) => new Promise((resolve) => {
      Vue.prototype.$http.post('/logs', {
        event: 'logged out from the system.',
      });
      commit('RESET', '');
      commit('UPDATE_HTTP_AUTH');
      Vue.cookie.delete('token');
      resolve();
    }),
    setToken: ({ commit }, token) => new Promise((resolve) => {
      commit('SET_TOKEN', token);
      commit('UPDATE_HTTP_AUTH');
      resolve();
    }),
    getUserData: ({ commit }) => new Promise((resolve, reject) => {
      Vue.prototype.$http.get('users/profile')
        .then((response) => {
          const { user } = response.data;
          commit('SET_USER', user);
          resolve(response);
        })
        .catch((error) => {
          Vue.cookie.delete('token');
          reject(error);
        });
    }),
  },
  modules: {
  },
});

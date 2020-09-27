import { createStore } from 'vuex';
import Authenticator from './util/netlify-login.js';
import router from './router.js';
import { ghql } from './util/ghql.js';
import { userProfile, rateLimit } from './util/gqlTags.js';

const store = createStore({
  state() {
    return {
      counter: 0,
      token: window.localStorage.getItem('token'),
      user: window.localStorage.getItem('user'),
    };
  },
  mutations: {
    increaseCounter(state, payload) {
      state.counter = state.counter + payload || 1;
      console.log('State:', state);
    },
    setToken: (state, token) => {
      state.token = token;
      window.localStorage.setItem('token', token);
    },
    setCurrentUser: (state, user) => {
      state.user = user;
    },
  },
  actions: {
    login(context, payload) {
      const authenticator = new Authenticator({
        site_id: `${import.meta.env.VITE_NETLIFY_APP_ID || null}`,
      });
      authenticator.authenticate(
        { provider: 'github', scope: 'read:user' },
        function (err, data) {
          if (err) {
            console.error(data);
          }
          const { token } = data;
          context.commit('setToken', token);
          context.dispatch('getCurrentUser');
          router.push({ name: 'Home' });
        }
      );
    },
    async getCurrentUser(context) {
      console.log('dispatching getCurrentUser', new Date().getTime());
      ghql(
        `
      {
        ${rateLimit}
        viewer {
          ${userProfile}
        }
      }
      `,
        store.state.token
      ).then(({ viewer }) => {
        context.commit('setCurrentUser', viewer);
      });
    },
    increaseCounter(context, payload) {
      context.commit('increaseCounter', payload);
    },
    logout: ({ commit }) => {
      commit('setToken', null);
      commit('setCurrentUser', null);
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getCurrentUser: (state) => state.user,
  },
});
export default store;

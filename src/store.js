import { createStore } from 'vuex';
import Authenticator from './util/netlify-login.js';
import router from './router.js';
import { ghql } from './util/ghql.js';
import {
  externalContributors,
  currentUser,
} from './util/gqlTags.js';

const store = createStore({
  state() {
    return {
      counter: 0,
      token: window.localStorage.getItem('token'),
      user: window.localStorage.getItem('user'),
      externalContributors: null,
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
    setExternalContributorsr: (state, externalContributors) => {
      state.externalContributors = externalContributors;
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
      ghql(currentUser,
        store.state.token
      ).then(({ viewer }) => {
        context.commit('setCurrentUser', viewer);
      });
    },
    async getExternalContributors(context) {
      ghql(externalContributors('org:kyma-project org:kyma-incubator is:pr',null), store.state.token).then(({ search }) => {
        context.commit('setExternalContributorsr', search.nodes);
      }).catch(error => console.error(error));
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

import { createStore } from 'vuex';
import Authenticator from './util/netlify-login.js';
import router from './router.js';
import { gqlFetch, sanitizeKey } from './util/gh-gql.js';
import {
  externalContributors,
  targetOrgMembers,
  initData,
} from './util/gqlTags.js';

const store = createStore({
  state() {
    return {
      menuOpen: false,
      token: window.localStorage.getItem('token'),
      viewer: null,
      externalContributors: null,
      targetOrgs: { 'kyma-project': null, 'kyma-incubator': null },
    };
  },
  mutations: {
    setMenu: (state, menuState) => {
      state.menuOpen = menuState;
    },
    setToken: (state, token) => {
      state.token = token;
      window.localStorage.setItem('token', token);
    },
    setViewer: (state, viewer) => {
      state.viewer = viewer;
    },
    setTargetOrgs: (state, orgs) => {
      orgs.map((org) => {
        state.targetOrgs[org.login] = org;
      });
    },
    updateTargetOrgs: (state, orgs) => {
      orgs.map((org) => {
        state.targetOrgs[org.login]['membersWithRole'].pageInfo =
          org['membersWithRole'].pageInfo;
        if (state.targetOrgs[org.login]['membersWithRole'].members) {
          state.targetOrgs[org.login]['membersWithRole'].members = [
            ...state.targetOrgs[org.login]['membersWithRole'].members,
            ...org['membersWithRole'].members,
          ];
        } else {
          state.targetOrgs[org.login]['membersWithRole'].members =
            org['membersWithRole'].members;
        }
      });
    },
    setExternalContributors: (state, externalContributors) => {
      state.externalContributors = externalContributors;
    },
  },
  actions: {
    login(context, payload) {
      const authenticator = new Authenticator({
        site_id: `${import.meta.env.VITE_NETLIFY_APP_ID || null}`,
      });
      authenticator.authenticate(
        { provider: 'github', scope: 'read:user, read:org' },
        function (err, data) {
          if (err) {
            console.error(data);
          }
          const { token } = data;
          context.commit('setToken', token);
          context.dispatch('getInitData');
          router.push({ name: 'Home' });
        }
      );
    },
    async getInitData(context) {
      const orgsKeys = Object.keys(context.state.targetOrgs);
      gqlFetch(initData(orgsKeys), store.state.token).then((result) => {
        const orgs = [];
        // we need to do this becasue graphql does not accept '-' in the key
        orgsKeys.map((key) => {
          const sanitizedKey = sanitizeKey(key);
          let selectedOrg = result[sanitizedKey];
          orgs.push(selectedOrg);
        });
        context.commit('setViewer', result.viewer);
        context.commit('setTargetOrgs', orgs);
        context.dispatch('getTargetOrgMembers', store.state.targetOrgs);
      });
    },
    async getTargetOrgMembers(context) {
      const orgsKeys = Object.keys(context.state.targetOrgs);
      let endCursor = null; // used to track pagination through the results
      function hasNextPage() {
        let hasNextPage = false;
        orgsKeys.map((key) => {
          let selectedOrg = context.state.targetOrgs[key];
          if (
            !hasNextPage &&
            selectedOrg.membersWithRole.pageInfo &&
            selectedOrg.membersWithRole.pageInfo.hasNextPage === false
          ) {
            hasNextPage = false;
          } else {
            hasNextPage = true;
          }
        });
        return hasNextPage;
      }
      if (hasNextPage()) {
        await gqlFetch(
          targetOrgMembers(context.state.targetOrgs),
          store.state.token
        )
          .then(async (result) => {
            const orgs = [];
            // we need to do this becasue graphql does not accept '-' in the key
            orgsKeys.map((key) => {
              const sanitizedKey = sanitizeKey(key);
              let selectedOrg = result[sanitizedKey];
              orgs.push(selectedOrg);
            });
            context.commit('updateTargetOrgs', orgs);
            if (hasNextPage()) await context.dispatch('getTargetOrgMembers');
          })
          .catch((error) => console.error(error));
      }
    },
    getExternalContributors(context) {
      gqlFetch(
        externalContributors('org:kyma-project org:kyma-incubator is:pr', null),
        store.state.token
      )
        .then(({ search }) => {
          context.commit('setExternalContributors', search.nodes);
        })
        .catch((error) => console.error(error));
    },

    logout: ({ commit, state }) => {
      commit('setToken', null);
      commit('setViewer', null);
      commit('setExternalContributors', null);
      window.localStorage.removeItem('token');
      window.sessionStorage.removeItem('graphqlCache');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    allMembers: (state) => {
      const orgsKeys = Object.keys(state.targetOrgs);
      let concatResult = [];
      let result = {};
      orgsKeys.map((key) => {
        let selectedOrg = state.targetOrgs[key];
        if (selectedOrg && selectedOrg.membersWithRole.members) {
          concatResult = [ ...concatResult, ...selectedOrg.membersWithRole.members]
        }
      }); 
      concatResult =concatResult.sort((a,b)=> b.followers.totalCount - a.followers.totalCount );
      concatResult.map(el => result[el.login] = el);
      return result;   
    }
  },
});
export default store;

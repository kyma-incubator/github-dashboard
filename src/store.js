import { createStore } from "vuex";
import Authenticator from "./util/netlify-login.js";
import router from "./router.js";
import { gqlFetch, sanitizeKey, arrayToObject } from "./util/gh-gql.js";
import {
  externalContributors,
  targetOrgMembers,
  reposOverview,
  openPullRequests,
  openIsues,
  initData
} from "./util/gqlTags.js";

const store = createStore({
  state() {
    return {
      menuOpen: false,
      token: window.localStorage.getItem("token"),
      viewer: null,
      externalContributors: null,
      targetOrgs: { "kyma-project": null, "kyma-incubator": null },
      alumniContributors: [
        "derberg",
        "hudymi",
        "aszecowka",
        "pkosiec",
        "tomekpapiernik",
        "mszostok"
      ],
      botsContributors: ["dependabot"],
      history: null
    };
  },
  mutations: {
    setMenu: (state, menuState) => {
      state.menuOpen = menuState;
    },
    setToken: (state, token) => {
      state.token = token;
      window.localStorage.setItem("token", token);
    },
    setHistory: (state, history) => {
      state.history = history.map(el => ({ ...el, date: new Date(el.date) }));
    },
    setViewer: (state, viewer) => {
      state.viewer = viewer;
    },
    setTargetOrgs: (state, orgs) => {
      orgs.map(org => {
        state.targetOrgs[org.login] = org;
      });
    },
    updateTargetOrgs: (state, { orgs, source }) => {
      orgs.map(org => {
        if (source === "getTargetOrgMembers") {
          let currentMembersWithRole =
            state.targetOrgs[org.login]["membersWithRole"];
          const newMembersWithRoles = org["membersWithRole"];
          if (newMembersWithRoles && newMembersWithRoles.members) {
            if (currentMembersWithRole.members !== undefined) {
              let newMembersWithRolesToObject = {};
              newMembersWithRoles.members.map(
                el => (newMembersWithRolesToObject[el.login] = el)
              );
              currentMembersWithRole.members = {
                ...currentMembersWithRole.members,
                ...newMembersWithRolesToObject
              };
              currentMembersWithRole.pageInfo = newMembersWithRoles.pageInfo;
            } else {
              state.targetOrgs[org.login]["membersWithRole"] = {
                pageInfo: org["membersWithRole"].pageInfo,
                totalCount: org["membersWithRole"].totalCount,
                members: arrayToObject(org["membersWithRole"].members, "login")
              };
            }
          }
        } else {
          let currentRepositories = state.targetOrgs[org.login]["repositories"];
          const newRepositories = org["repositories"];

          if (newRepositories && newRepositories.repos) {
            if (currentRepositories.repos !== undefined) {
              let newRepositoriesToObject = {};
              newRepositories.repos.map(
                el => (newRepositoriesToObject[el.name] = el)
              );
              currentRepositories.repos = {
                ...currentRepositories.repos,
                ...newRepositoriesToObject
              };
              currentRepositories.pageInfo = newRepositories.pageInfo;
            } else {
              state.targetOrgs[org.login]["repositories"] = {
                pageInfo: org["repositories"].pageInfo,
                totalCount: org["repositories"].totalCount,
                repos: arrayToObject(org["repositories"].repos, "name")
              };
            }
          }
        }
      });
    },
    setExternalContributors: (state, externalContributors) => {
      state.externalContributors = externalContributors.filter(
        el => state.botsContributors.indexOf(el.author.login) === -1
      );
    }
  },
  actions: {
    login(context) {
      const authenticator = new Authenticator({
        site_id: `${process.env.VUE_APP_NETLIFY_APP_ID || null}`
      });
      authenticator.authenticate(
        { provider: "github", scope: "read:user, read:org" },
        function(err, data) {
          if (err) {
            console.error(data);
          }
          const { token } = data;
          context.commit("setToken", token);
          context.dispatch("getInitData");
          router.push({ name: "Home" });
        }
      );
    },
    async getInitData(context) {
      const orgsKeys = Object.keys(context.state.targetOrgs);
      return gqlFetch(initData(orgsKeys), store.state.token).then(result => {
        const orgs = [];
        // we need to do this becasue graphql does not accept '-' in the key
        orgsKeys.map(key => {
          const sanitizedKey = sanitizeKey(key);
          let selectedOrg = result[sanitizedKey];
          orgs.push(selectedOrg);
        });
        context.commit("setViewer", result.viewer);
        context.commit("setTargetOrgs", orgs);
        return Promise.all([
          context.dispatch("getTargetOrgMembers", store.state.targetOrgs),
          context.dispatch("getReposOverview", store.state.targetOrgs),
          context.dispatch("getHistory", store.state.targetOrgs)
        ]);
      });
      // .then(() => Promise.all([
      //   context.dispatch("getOpenPullRequests", store.state.targetOrgs),
      //   context.dispatch("getOpenIssues", store.state.targetOrgs)
      // ]));
    },
    async getTargetOrgMembers(context) {
      const orgsKeys = Object.keys(context.state.targetOrgs);
      function hasNextPage() {
        let hasNextPage = false;
        orgsKeys.map(key => {
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
          .then(async result => {
            const orgs = [];
            // we need to do this becasue graphql does not accept '-' in the key
            orgsKeys.map(key => {
              const sanitizedKey = sanitizeKey(key);
              let selectedOrg = result[sanitizedKey];
              orgs.push(selectedOrg);
            });
            context.commit("updateTargetOrgs", {
              orgs,
              source: "getTargetOrgMembers"
            });
            if (hasNextPage()) await context.dispatch("getTargetOrgMembers");
          })
          .catch(error => console.error(error));
      }
    },
    getHistory(context) {
      return fetch("/results.json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          context.commit("setHistory", data);
        })
        .catch(error => console.error(error));
    },
    getExternalContributors(context) {
      let query = [];
      const orgsKeys = Object.keys(context.state.targetOrgs);
      orgsKeys.map(project => query.push(`org:${project}`));
      query.push("is:open");
      Object.keys(context.getters.allMembers).map(el =>
        query.push(`-author:${el}`)
      );
      context.state.alumniContributors.map(el => query.push(`-author:${el}`));
      return gqlFetch(
        externalContributors(query.join(" "), null),
        store.state.token
      )
        .then(({ search }) => {
          context.commit("setExternalContributors", search.nodes);
        })
        .catch(error => console.error(error));
    },
    getOpenPullRequests(context) {
      let reposWithPrs = [];
      const orgsKeys = Object.keys(context.state.targetOrgs);
      orgsKeys.map(key => {
        let selectedRepos = context.state.targetOrgs[key].repositories.repos;
        Object.keys(selectedRepos).map(repoId => {
          if (selectedRepos[repoId].openPullRequests.totalCount > 0) {
            reposWithPrs.push(selectedRepos[repoId]);
          }
        });
      });
      gqlFetch(openPullRequests(reposWithPrs), store.state.token)
        .then(response => {
          console.log(response);
          // context.commit("setExternalContributors", search.nodes);
        })
        .catch(error => console.error(error));
    },
    getOpenIssues(context) {
      let reposWithIssues = [];
      const orgsKeys = Object.keys(context.state.targetOrgs);
      orgsKeys.map(key => {
        let selectedRepos = context.state.targetOrgs[key].repositories.repos;
        Object.keys(selectedRepos).map(repoId => {
          if (selectedRepos[repoId].openIsues.totalCount > 0) {
            reposWithIssues.push(selectedRepos[repoId]);
          }
        });
      });
      gqlFetch(openIsues(reposWithIssues), store.state.token)
        .then(response => {
          console.log(response);
          // context.commit("setExternalContributors", search.nodes);
        })
        .catch(error => console.error(error));
    },
    getReposOverview(context) {
      gqlFetch(reposOverview(context.state.targetOrgs), store.state.token)
        .then(result => {
          const orgsKeys = Object.keys(context.state.targetOrgs);
          const orgs = [];
          // we need to do this becasue graphql does not accept '-' in the key
          orgsKeys.map(key => {
            const sanitizedKey = sanitizeKey(key);
            let selectedOrg = result[sanitizedKey];
            orgs.push(selectedOrg);
          });
          context.commit("updateTargetOrgs", {
            orgs,
            source: "getReposOverview"
          });
        })
        .catch(error => console.error(error));
    },

    logout: ({ commit }) => {
      commit("setToken", null);
      commit("setViewer", null);
      commit("setExternalContributors", null);
      window.localStorage.removeItem("token");
      window.sessionStorage.removeItem("graphqlCache");
    },
    clearCache: () => {
      window.sessionStorage.removeItem("graphqlCache");
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    allMembers: state => {
      const orgsKeys = Object.keys(state.targetOrgs);
      let concatResult = {};
      // let result = {};
      orgsKeys.map(key => {
        let selectedOrg = state.targetOrgs[key];
        if (selectedOrg && selectedOrg.membersWithRole.members) {
          concatResult = {
            ...concatResult,
            ...selectedOrg.membersWithRole.members
          };
        }
      });
      const sorted = Object.keys(concatResult)
        .sort(
          (a, b) =>
            concatResult[b].followers.totalCount -
            concatResult[a].followers.totalCount
        )
        .reduce((sortedElement, key) => {
          sortedElement[concatResult[key].login] = concatResult[key];
          return sortedElement;
        }, {});
      // concatResult = concatResult.sort(
      //   (a, b) => b.followers.totalCount - a.followers.totalCount
      // );
      // concatResult.map((el) => (result[el.login] = el));
      return sorted;
    }
  }
});
export default store;

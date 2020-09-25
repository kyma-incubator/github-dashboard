import { createStore } from 'vuex';
const store = createStore({
  state() {
    return {
      counter: 0,
      token: window.localStorage.getItem('token'),
      user: window.localStorage.getItem('user')
    };
  },
  mutations: {
    increaseCounter(state, payload) {
      state.counter = state.counter + payload || 1;
      console.log("State:", state)
    },
    setToken: (state, token) => {
      state.token = token
    },
    setUser: (state, user) => {
      state.user = user
    }    
  },
  actions: {
    increaseCounter(context, payload) {
      context.commit('increaseCounter', payload);
    },
    logout: ({ commit }) => {
      commit('setToken', null)
      commit('setUser', null)
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user')
    },    
    continueOAuth: (context, payload) => { 
      return fetch(`${import.meta.env.VITE_OAUTH_CODE_TO_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"code":payload}),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        const token = data.token;
        context.commit('setToken', token)
        window.localStorage.setItem('token', token)        
      })
      .catch((error) => {
        console.error('Error:', error);
      debugger;

      });
    },    
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getUser: state => state.user
  },
});
export default store;
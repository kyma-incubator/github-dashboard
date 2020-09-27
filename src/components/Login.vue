<template>
  <a @click="login">Login</a>
</template>

<script>
import { useStore } from "vuex";
export default {
  name: "Login",
  props: {
    msg: String,
  },
  setup(props, context) {
    const store = useStore();
    function login() {
      store.dispatch("login");
    }
    return {
      login,
    };
  },
};
</script>

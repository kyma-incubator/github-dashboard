<template>
  <h1>{{ msg }}</h1>
  <button @click="increaseCounter()">counter is: {{ counter }}</button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <pre>{{ user }}</pre>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "Home",
  props: {
    msg: String,
  },
  setup() {
    const store = useStore();
    const counter = computed(() => store.state.counter);
    const user = computed(() => store.state.user);
    if (!(user && user.value)) {
      console.log("getCurrentUser", user && user.value);
      store.dispatch("getCurrentUser");
    }
    function increaseCounter() {
      store.dispatch("increaseCounter", 1);
    }
    return {
      user,
      counter,
      increaseCounter,
    };
  },
};
</script>

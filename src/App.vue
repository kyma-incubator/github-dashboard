<template>
  <nav class="bg-white px-8 pt-2 shadow-md">
    <navigation></navigation>
  </nav>
  <div class="bg-white px-8 pt-2 shadow-md mt-10">
    <router-view></router-view>
  </div>
</template>

<script>
import navigation from "./components/Navigation.vue";
export default {
  components: {
    navigation,
  },
  name: "App",
  setup() {},
};
</script>

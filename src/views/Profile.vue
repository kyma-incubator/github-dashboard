<template>
  <pre class="text-xs">{{ viewer }}</pre>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "Home",
  props: {
    msg: String
  },
  setup() {
    const store = useStore();
    const viewer = computed(() => store.state.viewer);
    if (!viewer.value) {
      console.log("getInitData", viewer.value);
      store.dispatch("getInitData");
    }
    return {
      viewer
    };
  }
};
</script>

<template>
  <ul>
    <li v-for="node in externalContributors" :key="node.id">
      {{ node.author.login }}
    </li>
  </ul>
  <!-- <pre>{{ externalContributors }}</pre> -->
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "ExternalContributors",
  props: {
    msg: String,
  },
  setup() {
    const store = useStore();
    const externalContributors = computed(() => store.state.externalContributors);
    if (!(externalContributors && externalContributors.value)) {
      console.log("getExternalContributors", externalContributors && externalContributors.value);
      store.dispatch("getExternalContributors");
    }
    return {
      externalContributors,
    };
  },
};
</script>

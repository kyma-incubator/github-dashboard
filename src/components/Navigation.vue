<template>
  <div class="-mb-px flex justify-center">
    <router-link
      :to="{ name: 'Home' }"
      exact-active-class="border-teal-600 text-teal-600"
      class="no-underline text-grey-600 border-b-2 uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >Home</router-link
    >
    <router-link
      :to="{ name: 'ExternalContributors' }"
      exact-active-class="border-teal-600 text-teal-600"
      class="no-underline text-grey-600 border-b-2 uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >External Contributors</router-link
    >    
    <router-link
      :to="{ name: 'About' }"
      exact-active-class="border-teal-600 text-teal-600"
      class="no-underline text-grey-600 border-b-2 uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >About</router-link
    >
    <router-link
      v-if="isAuthenticated"
      :to="{ name: 'Logout' }"
      exact-active-class="border-teal-600 text-teal-600"
      class="no-underline text-grey-600 border-b-2 uppercase tracking-wide font-bold text-xs py-3"
      >Logout</router-link
    >
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    return {
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
</style>
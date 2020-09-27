<template>
  <nav class="bg-white px-8 pt-2 shadow-md">
    <div class="-mb-px flex justify-center">
      <router-link
        :to="{ name: 'Home'}"
        exact-active-class="border-teal-600 text-teal-600"
        class="no-underline text-grey-600 border-b-2 uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >Home</router-link>
      <router-link
        :to="{ name: 'About'}"
        exact-active-class="border-teal-600 text-teal-600"
        class="no-underline text-grey-600 border-b-2 uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >About</router-link>
      <router-link
        v-if="isAuthenticated"
        :to="{ name: 'Logout'}"
        exact-active-class="border-teal-600 text-teal-600"
        class="no-underline text-grey-600 border-b-2 uppercase tracking-wide font-bold text-xs py-3"
      >Logout</router-link>
    </div>
  </nav>
  <div class="bg-white px-8 pt-2 shadow-md mt-10">
    <router-view></router-view>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  name: "App",
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    return {
      isAuthenticated
    }
  },  
};
</script>

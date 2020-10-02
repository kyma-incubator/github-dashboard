<template>
  <!-- Backdrop -->
  <div
    :class="menuOpen ? 'block' : 'hidden'"
    @click="closeMenu"
    class="fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden"
  ></div>
  <!-- End Backdrop -->
  <div
    :class="
      menuOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
    "
    class="fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0"
  >
    <div class="flex items-center justify-center mt-8">
      <div class="flex items-center">
        <LogoIcon />

        <span class="text-white text-2xl mx-2 font-semibold">GH Dashboard</span>
      </div>
    </div>

    <nav class="mt-10">
      <router-link
        class="flex items-center mt-4 py-2 px-6 border-l-4"
        :class="[$route.name === 'Home' ? activeClass : inactiveClass]"
        :to="{ name: 'Home' }"
      >
        <PieIcon />

        <span class="mx-4">Overview</span>
      </router-link>

      <router-link
        class="flex items-center mt-4 py-2 px-6 border-l-4"
        :class="[$route.name === 'ExternalContributors' ? activeClass : inactiveClass]"
        :to="{ name: 'ExternalContributors' }"
      >
        <PieIcon />

        <span class="mx-4">Externals</span>
      </router-link>

      <router-link
        class="flex items-center mt-4 py-2 px-6 border-l-4"
        :class="[$route.name === 'Team' ? activeClass : inactiveClass]"
        :to="{ name: 'Team' }"
      >
        <PieIcon />

        <span class="mx-4">Team</span>
      </router-link>

      <router-link
        class="flex items-center mt-4 py-2 px-6 border-l-4"
        :class="[$route.name === 'About' ? activeClass : inactiveClass]"
        :to="{ name: 'About' }"
      >
        <PieIcon />

        <span class="mx-4">About</span>
      </router-link>

    </nav>
  </div>
  <!-- <div class="-mb-px flex justify-center">
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
  </div> -->
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { defineComponent, ref } from "vue";
import LogoIcon from "./Icon/LogoIcon.vue";
import PieIcon from "./Icon/PieIcon.vue";

export default defineComponent({
  name: "Sidebar",
  components: {
    LogoIcon,
    PieIcon,
  },
  setup() {
    const store = useStore();
    const menuOpen = computed(() => store.state.menuOpen);
    function openMenu() {
      store.commit('setMenu', true)
    }
    function closeMenu() {
      store.commit('setMenu', false)
    }    
    const activeClass = ref(
      "bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100"
    );
    const inactiveClass = ref(
      "border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
    );
    return {
      menuOpen,
      openMenu,
      closeMenu,
      activeClass,
      inactiveClass,
    };
  },
});
</script>

<style scoped>
</style>
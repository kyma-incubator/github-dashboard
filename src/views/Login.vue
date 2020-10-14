<template>
  <div class="flex justify-center items-center h-screen bg-gray-200 px-6">
    <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
      <div class="flex justify-center items-center">
        <ChartLineArea class="mr-3" v-bind="iconConfig" />
        <span class="text-gray-700 font-semibold text-2xl">GH Dashboard</span>
      </div>

      <form class="mt-4" @submit.prevent="login">
        <div class="mt-6">
          <button
            type="submit"
            class="py-2 px-4 text-center bg-blue-600 rounded-md w-full text-white text-sm hover:bg-indigo-500"
          >
            Login in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ChartLineArea } from "@icon-park/vue-next";

export default {
  name: "Login",
  components: {
    ChartLineArea,
  },
  setup() {
    const store = useStore();
    function login() {
      store.dispatch("login");
    }
    const iconConfig = {
      theme: "multi-color",
      size: "48",
      "stroke-width": 3,
      fill: ["#000", "#2F88FF", "#FFF", "#43CCF8"]
    };
    return {
      login,
      iconConfig
    };
  }
};
</script>

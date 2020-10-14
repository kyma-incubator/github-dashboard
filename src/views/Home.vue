<template>
  <div class="mt-4 mb-10" v-for="(org, key) in targetOrgs" :key="key">
    <h3 class="text-gray-700 text-3xl font-medium flex" v-if="org && org.id">
      <div class="flex-shrink-0 w-10 h-10">
        <img class="w-full h-full rounded-full" :src="org.avatarUrl" alt />
      </div>

      <div class="ml-3">
        <span>{{ org.name }}</span>
      </div>
    </h3>
    <div class="flex flex-wrap -mx-6" v-if="org && org.id">
      <OverviewCard title="Team Size" :count="org.membersWithRole.totalCount">
        <div class="p-3 rounded-full bg-indigo-600 bg-opacity-75">
          <TeamIcon />
        </div>
      </OverviewCard>

      <OverviewCard title="Total Repos" :count="org.repositories.totalCount">
        <div class="p-3 rounded-full bg-orange-600 bg-opacity-75">
          <ShoppingCardIcon />
        </div>
      </OverviewCard>

      <OverviewCard title="Total Stars" :count="getStars(org)">
        <div class="p-3 rounded-full bg-pink-600 bg-opacity-75">
          <ShoppingBagIcon />
        </div>
      </OverviewCard>

      <OverviewCard
        title="Total open Pull Requests"
        :count="getOpenPullRequests(org)"
      >
        <div class="p-3 rounded-full bg-pink-600 bg-opacity-75">
          <ShoppingBagIcon />
        </div>
      </OverviewCard>

      <OverviewCard title="Totalopen Issues" :count="getOpenissues(org)">
        <div class="p-3 rounded-full bg-pink-600 bg-opacity-75">
          <ShoppingBagIcon />
        </div>
      </OverviewCard>
    </div>
  </div>
  <!-- <pre class="text-xs">{{ historyGroups }}</pre> -->
  <div ref="container"></div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
// import { Area } from "@antv/g2plot";

// import crossfilter from 'crossfilter2';
import OverviewCard from "../components/OverviewCard.vue";
import {
  ShoppingCardIcon,
  ShoppingBagIcon,
  TeamIcon
} from "../components/Icons";

export default {
  name: "Home",
  components: {
    OverviewCard,
    ShoppingCardIcon,
    ShoppingBagIcon,
    TeamIcon
  },
  setup() {
    const container = ref(null);
    const store = useStore();
    const targetOrgs = computed(() => store.state.targetOrgs);
    const history = computed(() => store.state.history);
    const viewer = computed(() => store.state.viewer);
    function getStars(org) {
      return (
        org.repositories.repos &&
        Object.keys(org.repositories.repos).reduce(
          (accumulator, repoId) =>
            accumulator + org.repositories.repos[repoId].stargazerCount,
          0
        )
      );
    }
    // const historyGroups = computed(() => {
    //   const crossHistory = crossfilter(history)
    //   let crossHistoryByOrganization = crossHistory.dimension((d) => d.organization);
    //   let crossHistoryByType = crossHistory.dimension((d) => d.type);
    //   debugger;
    //   return {
    //     crossHistoryByOrganization,
    //     crossHistoryByType
    //   }
    // });
    // function historyGroups() {
    //   const crossHistory = crossfilter(history)
    //   let crossHistoryByOrganization = crossHistory.dimension((d) => d.organization);
    //   let crossHistoryByType = crossHistory.dimension((d) => d.type);
    //   return {
    //     crossHistoryByOrganization,
    //     crossHistoryByType
    //   }
    // }
    function getOpenPullRequests(org) {
      return (
        org.repositories.repos &&
        Object.keys(org.repositories.repos).reduce(
          (accumulator, repoId) =>
            accumulator +
            org.repositories.repos[repoId].openPullRequests.totalCount,
          0
        )
      );
    }
    function getOpenissues(org) {
      return (
        org.repositories.repos &&
        Object.keys(org.repositories.repos).reduce(
          (accumulator, repoId) =>
            accumulator + org.repositories.repos[repoId].openIsues.totalCount,
          0
        )
      );
    }
    if (!viewer.value) {
      console.log("getInitData", targetOrgs.value);
      store.dispatch("getInitData");
    }

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      // const area = new Area(container.value, {
      //   data: history.value || [],
      //   height: 1000,
      //   xField: "date",
      //   yField: "count",
      //   seriesField: "type",
      //   slider: {
      //     start: 0.1,
      //     end: 0.9
      //   }
      // });
      // area.render();
    });
    return {
      targetOrgs,
      getStars,
      getOpenPullRequests,
      getOpenissues,
      history,
      container
    };
  }
};
</script>

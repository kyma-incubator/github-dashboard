<template >
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
  <!-- <pre class="text-xs">{{ targetOrgs }}</pre> -->
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import OverviewCard from "../components/OverviewCard.vue";
import {
  ShoppingCardIcon,
  ShoppingBagIcon,
  TeamIcon,
} from "../components/Icons";

export default {
  name: "Home",
  components: {
    OverviewCard,
    ShoppingCardIcon,
    ShoppingBagIcon,
    TeamIcon,
  },
  props: {
    msg: String,
  },
  setup() {
    const store = useStore();
    const targetOrgs = computed(() => store.state.targetOrgs);
    const viewer = computed(() => store.state.viewer);
    function getStars(org) {
      return org.repositories.repos && org.repositories.repos.reduce((accumulator, repo) => accumulator + repo.stargazerCount, 0)
    }
    function getOpenPullRequests(org) {
      return org.repositories.repos && org.repositories.repos.reduce((accumulator, repo) => accumulator + repo.openPullRequests.totalCount, 0)
    }
    function getOpenissues(org) {
      return org.repositories.repos && org.repositories.repos.reduce((accumulator, repo) => accumulator + repo.openIsues.totalCount, 0)
    }        
    if (!(viewer && viewer.value)) {
      console.log("getInitData", targetOrgs && targetOrgs.value);
      store.dispatch("getInitData");
    }
    return {
      targetOrgs,
      getStars,
      getOpenPullRequests,
      getOpenissues,
    };
  },
};
</script>

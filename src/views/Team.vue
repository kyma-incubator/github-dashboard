<template>
  <div class="mt-8">
    <div class="mt-6">
      <h2 class="text-xl font-semibold text-gray-700 leading-tight">
        Official Kyma Team Members
      </h2>

      <div class="mt-3 flex flex-col sm:flex-row">
        <div class="block relative mt-2 sm:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
              <path
                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
              />
            </svg>
          </span>

          <input
            placeholder="Search"
            v-model="searchTerm"
            class="appearance-none rounded border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
          />
        </div>
      </div>
            {{selectedItem}} - {{searchTerm}}
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Twitter
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Total Repos
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Followers
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(u, index) in filteredMembers" :key="index">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        class="w-full h-full rounded-full"
                        :src="u.avatarUrl"
                        alt
                      />
                    </div>

                    <div class="ml-3">
                      <div
                        class="text-sm text-gray-900 whitespace-no-wrap font-medium"
                      >
                        {{ u.name || u.login }}
                      </div>
                      <div class="text-sm text-gray-500 whitespace-no-wrap">
                        {{ u.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 text-xs hitespace-no-wrap">
                    {{ u.company }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 text-sm whitespace-no-wrap">
                    <a
                      :href="`https://twitter.com/${u.twitterUsername}`"
                      target="_blank"
                      >{{ u.twitterUsername }}</a
                    >
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ u.repositories.totalCount }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    :class="`relative inline-block px-3 py-1 font-semibold text-${u.statusColor}-900 leading-tight`"
                  >
                    <span
                      aria-hidden
                      :class="`absolute inset-0 bg-${u.statusColor}-200 opacity-50 rounded-full`"
                    ></span>
                    <span class="relative">{{ u.followers.totalCount }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
export default {
  name: "Home",
  props: {
    msg: String,
  },
  setup() {
    const store = useStore();
    let selectedItem = ref('All');
    let searchTerm = ref('');
    const allMembers = computed(() => {
      const initial = store.getters.allMembers;
      const sorted = Object.keys(initial)
        .sort(
          (a, b) =>
            initial[b].followers.totalCount - initial[a].followers.totalCount
        )
        .reduce((sorted, key) => {
          sorted[key] = initial[key];
          return sorted;
        }, {});
      return sorted;
    });
    let hasMembers = computed(() => {
      if (allMembers &&
        allMembers.value &&
        Object.keys(allMembers.value).length > 0) {
        return true;
      } else {
        return false
      }
    })
    let filteredMembers = computed(()=>{
      let filteredResult = {};
      if (hasMembers.value) {
        Object.keys(allMembers.value).map( userLogin => {
          const textVersion = JSON.stringify(allMembers.value[userLogin]).toLowerCase()
          if (textVersion.includes(searchTerm.value.toLowerCase().trim())) {
            filteredResult[userLogin] = allMembers.value[userLogin];
          }
        })        
      } 
      console.log(filteredResult)
      return filteredResult;
    });
    if (!hasMembers.value) {
      console.log("getInitData", allMembers && allMembers.value);
      store.dispatch("getInitData");
    }
    return {
      allMembers,
      filteredMembers,
      selectedItem,
      searchTerm
    };
  },
};
</script>

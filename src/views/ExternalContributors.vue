<template>
  <div class="mt-8">
    <div class="mt-6">
      <h2 class="text-xl font-semibold text-gray-700 leading-tight">
        External Contributors
      </h2>

      <div class="mt-3 flex flex-col sm:flex-row">
        <div class="flex">
          <div class="relative">
            <select
              class="appearance-none h-full rounded border-t sm:rounded-r-none sm:border-r-0 border-r border-b border-l block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
            >
              <option>All</option>
              <option>Issue</option>
              <option>PullRequest</option>
            </select>

            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
        </div>

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
            class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
          />
        </div>
      </div>

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
                  Title
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Repo
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Date Created
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Issue Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="node in externalContributors" :key="node.id">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        class="w-full h-full rounded-full"
                        :src="node.author.avatarUrl"
                        alt
                      />
                    </div>

                    <div class="ml-3">
                      <div
                        class="text-sm text-gray-900 whitespace-no-wrap font-medium"
                      >
                        {{ node.author.login }}
                      </div>
                      <div class="text-sm text-gray-500 whitespace-no-wrap">
                        
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 text-xs hitespace-no-wrap">
                    <a
                      :href="`${node.url}`"
                      target="_blank"
                      >{{ node.title }}</a
                    > 
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 text-sm whitespace-no-wrap">
                    <a
                      :href="`${node.url}`"
                      target="_blank"
                      >{{ extractOrganizationFromUrl(node.resourcePath).organization }}/{{ extractOrganizationFromUrl(node.resourcePath).project }}</a
                    >
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ new Date(node.createdAt).toLocaleDateString('de') }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    :class="`relative inline-block px-3 py-1 font-semibold leading-tight`"
                  >
                    <span
                      aria-hidden
                      :class="`absolute inset-0  opacity-50 rounded-full`"
                    ></span>
                    <span class="relative">{{ node.type }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>  
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
    const externalOpenIsuessContributors = computed(() => store.state.externalContributors.filter(el => el.type === 'Issue'));
    const externalPullRequestsContributors = computed(() => store.state.externalContributors.filter(el => el.type === 'PullRequest'));
    if (!(externalContributors && externalContributors.value)) {
      console.log("getExternalContributors", externalContributors && externalContributors.value);
      store.dispatch("getExternalContributors");
    }
    function extractOrganizationFromUrl(url) {
      const splitted = url.split('/');
      const organization = splitted[1];
      const project = splitted[2];
      return {
        organization,
        project
      }
    }
    return {
      extractOrganizationFromUrl,
      externalContributors
    };
  },
};
</script>

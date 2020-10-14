<template>
  <div class="w-full mt-6 mb-6 px-3 sm:w-1/2 xl:w-1/3 xl:mt-0">
    <div class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
      <slot />

      <div class="mx-5">
        <h4 class="text-2xl font-semibold text-gray-700">
          {{ count }}
        </h4>
        <div class="text-gray-500">{{ title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverviewCard",
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  }
};
</script>

<template>
  <!-- <pre>{{ config}}</pre> -->
  <template v-for="(org, orgKey) in gOrg" :key="orgKey">
    <h1>{{ orgKey }}</h1>
    <template v-for="(type, typeKey) in org" :key="typeKey">
      <h2>{{ typeKey }}</h2>
      <ColumnChart v-bind="config" :data="toArray(type)" />
    </template>
  </template>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { flow, groupBy, mapValues, toArray, reduce } from "lodash/fp";
import { ColumnChart } from "@opd/g2plot-vue";
export default {
  name: "PageA",
  components: {
    ColumnChart
  },
  setup() {
    const store = useStore();
    const history = computed(() => store.state.history);
    const gOrg = flow(
      groupBy("organization"),
      mapValues(groupBy("type")),
      mapValues(mapValues(groupBy("date"))),
      mapValues(
        mapValues(
          mapValues(
            reduce(
              (prev, e) => ({ date: e.date, count: prev.count + e.count }),
              { date: null, count: 0 }
            )
          )
        )
      )
    )(history.value);
    return {
      gOrg,
      toArray,
      config: {
        height: 200,
        padding: "auto",
        xField: "date",
        yField: "count"
      }
    };
  }
};
</script>

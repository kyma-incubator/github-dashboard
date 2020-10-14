<template>
  <section class="p-6 bg-white rounded-md shadow-md">
    <div class="mx-auto flex flex-wrap">
      <button @click="resetAll">Reset all filters</button>

      <div class="flex flex-wrap -mx-2">
        <div class="px-2 w-1/3">
          <div
            class="flex flex-wrap w-full sm:py-24 py-16 sm:px-10 px-6 relative"
          >
            <div class="text-center relative z-10 w-full">
              <h2 class="text-m text-gray-900 font-medium title-font mb-2">
                Filter by year
              </h2>
              <div
                class="w-full h-full object-center block "
                ref="yearPie"
              ></div>
            </div>
          </div>
        </div>
        <div class="px-2 w-1/3">
          <div
            class="flex flex-wrap w-full sm:py-24 py-16 sm:px-10 px-6 relative"
          >
            <div class="text-center relative z-10 w-full">
              <h2 class="text-m text-gray-900 font-medium title-font mb-2">
                Filter by day of week
              </h2>
              <div
                class="w-full h-full object-center block "
                ref="dayOfWeekRef"
              ></div>
            </div>
          </div>
        </div>
        <div class="px-2 w-1/3">
          <div
            class="flex flex-wrap w-full sm:py-24 py-16 sm:px-10 px-6 relative"
          >
            <div class="text-center relative z-10 w-full">
              <h2 class="text-m text-gray-900 font-medium title-font mb-2">
                Filter by issue type
              </h2>
              <div
                class="w-full h-full object-center block "
                ref="typeRef"
              ></div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap w-full py-2 px-10 relative mb-4">
          <div class="text-center relative z-10 w-full">
            <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
              All Interactions
            </h2>
            <div>
              <div
                class="w-full h-full object-center block "
                ref="allInteractions"
              ></div>
              <div
                class="w-full h-full object-center block "
                ref="allInteractionsRange"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- <pre>{{ history }}</pre> -->
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import crossfilter from "crossfilter2";
import { barChart, pieChart, rowChart, filterAll, renderAll } from "dc";
import { scaleTime, timeWeek, timeWeeks, timeDay, timeDays } from "d3";
export default {
  name: "History",
  setup() {
    let allInteractions = ref(null);
    let dayOfWeekRef = ref(null);
    let typeRef = ref(null);
    let allInteractionsRange = ref(null);
    let yearPie = ref(null);
    const store = useStore();
    const history = computed(() => store.state.history);
    // const parseDate = timeParse("%Y-%m-%d");
    const ndx = crossfilter(
      history.value.map(el => ({
        ...el,
        week: timeWeek(el.date),
        year: el.date.getFullYear()
      }))
    );
    const dateDim = ndx.dimension(d => d.date);
    const minDate = dateDim.bottom(1)[0].date;
    const maxDate = dateDim.top(1)[0].date;
    const dayTotal = dateDim.group().reduceSum(d => d.count);
    const weekDim = ndx.dimension(d => d.week);
    const weekTotal = weekDim.group().reduceSum(d => d.count);
    const dayOfWeekDim = ndx.dimension(d => {
      const day = d.date.getDay();
      const name = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return `${day}.${name[day]}`;
    });
    const dayOfWeekGroup = dayOfWeekDim.group();

    const yearDim = ndx.dimension(d => +d.year);
    const yearTotal = yearDim.group().reduceSum(d => d.count);

    const typeDim = ndx.dimension(d => d.type);
    const typeGroup = typeDim.group();
    const resetAll = function() {
      filterAll();
      renderAll();

      return true;
    };
    // console.log(dayOfWeekGroup);
    onMounted(() => {
      console.log(yearPie.value, ndx);
      let rangeChart = barChart(allInteractionsRange.value)
        .width(
          allInteractionsRange.value.containerWidth
        ) /* dc.barChart('#weekly-volume-chart', 'chartGroup'); */
        .height(40)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(weekDim)
        .group(weekTotal)
        .centerBar(true)
        .gap(1)
        .x(scaleTime().domain([minDate, maxDate]))
        .xUnits(timeWeeks)
        .round(timeWeek.round)
        .alwaysUseRounding(true);
      rangeChart.yAxis().ticks(0);

      let allInteractionsChart = barChart(allInteractions.value)
        .width(allInteractions.value.containerWidth)
        .height(600)
        .dimension(dateDim)
        .group(dayTotal, "Interactions")
        .centerBar(true)
        .x(scaleTime().domain([minDate, maxDate]))
        .round(timeDay.round)
        .alwaysUseRounding(true)
        .xUnits(timeDays)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .rangeChart(rangeChart)
        .brushOn(false)
        .mouseZoomable(true)
        .title(
          d =>
            `${new Date(d.key).toLocaleDateString("de")}\n Total Interactions:${
              d.value
            }`
        );

      const yearlyChart = pieChart(yearPie.value)
        .width(yearPie.value.clientWidth)
        .height(yearPie.value.clientWidth)
        .dimension(yearDim)
        .group(yearTotal)
        .innerRadius(30);

      const dayOfWeekChart = rowChart(dayOfWeekRef.value)
        .width(dayOfWeekRef.value.clientWidth)
        .height(dayOfWeekRef.value.clientWidth)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(dayOfWeekGroup)
        .dimension(dayOfWeekDim)
        // Assign colors to each value in the x scale domain
        .ordinalColors(["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#dadaeb"])
        .label(d => d.key.split(".")[1])
        // Title sets the row text
        .title(d => d.value)
        .elasticX(true);
      dayOfWeekChart.xAxis().ticks(4);

      const typeChart = pieChart(typeRef.value)
        .width(typeRef.value.clientWidth)
        .height(typeRef.value.clientWidth)
        .group(typeGroup)
        .dimension(typeDim)
        .label(d => d.key.split("Event")[0])
        // Assign colors to each value in the x scale domain
        .ordinalColors(["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#dadaeb"]);

      rangeChart.render();
      yearlyChart.render();
      dayOfWeekChart.render();
      typeChart.render();
      rangeChart.render();
      allInteractionsChart.render();
    });
    return {
      history,
      dayOfWeekRef,
      typeRef,
      allInteractions,
      allInteractionsRange,
      yearPie,
      resetAll
    };
  }
};
</script>

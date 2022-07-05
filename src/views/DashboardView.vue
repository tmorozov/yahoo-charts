<script setup lang="ts">
import { ref } from "vue";
import CandleChart from "@/components/CandleChart.vue";
import type { ChartData } from "@/components/CandleChart.vue";
import symbols from "../../config/symbols.json";
import periods from "../../config/periods.json";

const chartsData = ref<{
  [key: string]: ChartData[];
}>({});
const activePeriod = ref(periods[0]);

function onPeriod(period: string) {
  activePeriod.value = period;
}

async function loadData() {
  for (const period of periods) {
    chartsData.value = {
      ...chartsData.value,
      [period]: [],
    };
    for (const symbol of symbols) {
      const module = await import(`../../data/${period}_${symbol}.json`);
      chartsData.value = {
        ...chartsData.value,
        [period]: [...chartsData.value[period], module.default],
      };
    }
  }
  console.log(chartsData.value["1M"]);
}

loadData();
</script>

<template>
  <main>
    <ul class="periods">
      <li v-for="period in periods" :key="period">
        <a
          @click="onPeriod(period)"
          :class="{ active: period === activePeriod }"
          >{{ period }}</a
        >
      </li>
    </ul>
    <div class="charts-wrapper">
      <CandleChart
        class="chart-item"
        v-for="chart in chartsData[activePeriod]"
        :chart-data="chart"
        :key="chart.id + chart.type"
      />
    </div>
  </main>
</template>

<style>
.periods {
  margin: 0;
  padding: 0;
}
.periods li {
  display: inline;
  padding: 0 1rem;
  cursor: pointer;
}
.periods a.active {
  color: var(--color-text);
}

.charts-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.chart-item {
  max-width: 25%;
}
</style>

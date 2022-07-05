<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as Plot from "@observablehq/plot";

export interface ChartData {
  id: string;
  type: string;
  attributes: {
    [key: string]: {
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    };
  };
}
const props = defineProps<{
  chartData: ChartData;
}>();

const [, period] = props.chartData.type.split("_");

interface Bar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const data: Bar[] = Object.entries(props.chartData.attributes).map(
  ([date, values]) => {
    return {
      ...values,
      date,
    };
  }
);

const plot = Plot.plot({
  y: {
    grid: true,
  },
  color: {
    domain: [-1, 0, 1],
    range: ["#e41a1c", "#999999", "#4daf4a"],
  },
  style: {
    background: "black",
    color: "grey",
  },
  marks: [
    Plot.ruleX(data, {
      x: "date",
      y1: "low",
      y2: "high",
    }),
    Plot.ruleX(data, {
      x: "date",
      y1: "open",
      y2: "close",
      stroke: (d: Bar) => Math.sign(d.close - d.open),
      strokeWidth: 2,
      //   strokeLinecap: "round",
    }),
  ],
});

const chart = ref(null);
onMounted(() => {
  chart.value?.append(plot);
});
</script>

<template>
  <div class="chart">
    <h1>{{ chartData.id }} {{ period }}</h1>
    <div ref="chart"></div>
  </div>
</template>

<style>
.chart {
  padding: 0 5px;
}
</style>

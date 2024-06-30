<template>
  <div class="flex flex-wrap md:flex-nowrap gap-2 ">
    <UCard class="lg:w-6/12 w-screen " :ui="{ ring: '', shadow: 'shadow-md'}">
      <template #header>
          <h2 class="font-semibold text-gray-800">Thống Kê Doanh Thu</h2>
      </template>

      <canvas ref="canvas1"></canvas>
    </UCard>
    <UCard class="lg:w-6/12 w-screen " :ui="{ ring: '', shadow: 'shadow-md'}">
      <template #header>
        <h2 class="font-semibold text-gray-800">Thống Kê Đơn Hàng</h2>
      </template>
      <canvas ref="canvas2"></canvas>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import {OrderService} from "~/services/OrderService";
import {Chart, registerables} from "chart.js";
import {format} from "date-fns";

Chart.register(...registerables);

definePageMeta({
  middleware: ['auth']
})
interface OrderItem {
  total_price: number;
  total_order: number;
  date: string;
}
const avg = reactive({
  order:0,
  orderTrend:0,
  total:0,
  totalTrend:0
})
const canvas1 = ref<HTMLCanvasElement>()
const canvas2 = ref<HTMLCanvasElement>()

const orderService = new OrderService()
onMounted(async () => {
  const a = await orderService.overviewAsync()
  console.log(a)
  const total_price = Array.from(sortByDate(a)).map(item => item.total_price)
  const total_order= Array.from(sortByDate(a)).map(item => item.total_order)
  avg.order = tinhTrungBinh(total_order)
  avg.orderTrend =tinhTangTruong(total_order)
  const label = Array.from(sortByDate(a)).map(item => format(new Date(item.date), 'dd-MM'))
  drawChart(label, {
    data: total_price,
    ctx:canvas1.value?.getContext('2d')
  })
  drawChart(label, {
    data: total_order,
    ctx:canvas2.value?.getContext('2d')
  })
})
function sortByDate(data: OrderItem[]): OrderItem[] {
  return data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
}
function tinhTrungBinh(mangSo: number[]): number {
  let tongSo = 0;
  for (let so of mangSo) {
    tongSo += so;
  }
  return tongSo / mangSo.length;
}

function tinhTangTruong(mangSo: number[]): number {
  if (mangSo.length <= 1) {
    return 0;
  }

  const firstValue = mangSo[0];
  const tangTruong = mangSo.reduce((tongTangTruong, currentValue, index) => {
    if (index === 0) {
      return 0; // Bỏ qua phần tử đầu tiên
    }

    const phanTramTangTruong = (currentValue - firstValue) / firstValue * 100;
    return tongTangTruong + phanTramTangTruong;
  }, 0);

  return tangTruong / (mangSo.length - 1);
}
function drawChart(labels: string[], options: any) {
// Define Chart.js default settings
  Chart.defaults.font.family = '"Inter", sans-serif';
  Chart.defaults.color = 'rgb(148, 163, 184)';
  Chart.defaults.scale.grid.color = 'rgb(241, 245, 249)';
  Chart.defaults.plugins.tooltip.titleColor = 'rgb(30, 41, 59)';
  Chart.defaults.plugins.tooltip.bodyColor = 'rgb(30, 41, 59)';
  Chart.defaults.plugins.tooltip.backgroundColor = '#FFF';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.borderColor = 'rgb(226, 232, 240)';
  Chart.defaults.plugins.tooltip.displayColors = false;
  Chart.defaults.plugins.tooltip.mode = 'nearest';
  Chart.defaults.plugins.tooltip.intersect = false;
  Chart.defaults.plugins.tooltip.position = 'nearest';
  Chart.defaults.plugins.tooltip.caretSize = 0;
  Chart.defaults.plugins.tooltip.caretPadding = 20;
  Chart.defaults.plugins.tooltip.cornerRadius = 4;
  Chart.defaults.plugins.tooltip.padding = 8;
  const chart = new Chart(options.ctx!, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        // Indigo line
        {
          label: 'Current',
          data:options.data,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 2,
          pointHoverRadius: 3,
          pointBackgroundColor: 'rgb(99, 102, 241)',
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatThousands(value),
          },
        },
        x: {
          grid: {
            drawOnChartArea: false
          },
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: () => false, // Disable tooltip title
            label: (context) => formatThousands(context.parsed.y),
          },
        },
      },
    }
  });
}

// Helper function to display thousands in K format
const formatThousands = (value: any) => Intl.NumberFormat('vi-VN', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);
</script>

<style>

</style>
import { createRouter, createWebHistory } from 'vue-router'
import DualCharts from '../components/DualCharts.vue'
import KLineChart from '../components/KLineChart.vue'
import HeatMapChart from '../components/HeatMapChart.vue'
import ThreeDChart from '../components/ThreeDChart.vue'

const routes = [
  {
    path: '/',
    name: 'DualCharts',
    component: DualCharts
  },
  {
    path: '/kline',
    name: 'KLineChart',
    component: KLineChart
  },
  {
    path: '/heatmap',
    name: 'HeatMapChart',
    component: HeatMapChart
  },
  {
    path: '/3d',
    name: 'ThreeDChart',
    component: ThreeDChart
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
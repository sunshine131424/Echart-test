<template>
  <div class="chart-container">
    <div id="mainChart" style="width: 800px; height: 600px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'KLineChart',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('mainChart'))
      
      // 模擬K線數據
      const rawData = [
        ['2023/1/1', 2320.26, 2320.26, 2287.3, 2362.94, 100],
        ['2023/1/2', 2300, 2291.3, 2288.26, 2308.38, 200],
        ['2023/1/3', 2295.35, 2346.5, 2295.35, 2346.92, 400],
        ['2023/1/4', 2347.22, 2358.98, 2337.35, 2363.8, 600],
        ['2023/1/5', 2360.75, 2382.48, 2347.89, 2383.76, 800],
        ['2023/1/6', 2383.43, 2385.42, 2371.23, 2391.82, 300],
        ['2023/1/7', 2377.41, 2419.02, 2369.57, 2421.15, 500],
      ]

      const data = this.splitData(rawData)
      
      const option = {
        animation: false,
        legend: {
          bottom: 10,
          left: 'center',
          data: ['K線', 'MA5', 'MA10', 'MA20', 'Volume']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          }
        },
        axisPointer: {
          link: [{ xAxisIndex: 'all' }],
          label: {
            backgroundColor: '#777'
          }
        },
        grid: [
          {
            left: '10%',
            right: '8%',
            height: '50%'
          },
          {
            left: '10%',
            right: '8%',
            top: '63%',
            height: '16%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax'
          },
          {
            type: 'category',
            gridIndex: 1,
            data: data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: 'dataMin',
            max: 'dataMax'
          }
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 0,
            end: 100
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '85%',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: 'K線',
            type: 'candlestick',
            data: data.values,
            itemStyle: {
              color: '#ef232a',
              color0: '#14b143',
              borderColor: '#ef232a',
              borderColor0: '#14b143'
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: this.calculateMA(5, data),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.volumes
          }
        ]
      }

      this.chart.setOption(option)
    },
    splitData(rawData) {
      const categoryData = []
      const values = []
      const volumes = []
      
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i][0])
        values.push([
          rawData[i][1],
          rawData[i][2],
          rawData[i][3],
          rawData[i][4]
        ])
        volumes.push([i, rawData[i][5], rawData[i][1] > rawData[i][2] ? 1 : -1])
      }
      
      return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
      }
    },
    calculateMA(dayCount, data) {
      const result = []
      for (let i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-')
          continue
        }
        let sum = 0
        for (let j = 0; j < dayCount; j++) {
          sum += data.values[i - j][1]
        }
        result.push((sum / dayCount).toFixed(2))
      }
      return result
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
}
</style> 
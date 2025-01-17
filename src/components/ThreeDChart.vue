<template>
  <div class="chart-container">
    <div ref="chartDom" id="mainChart" style="width: 1200px; height: 800px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'

export default {
  name: 'ThreeDChart',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      try {
        const chartDom = this.$refs.chartDom
        this.chart = echarts.init(chartDom)

        // 生成數據
        const data = this.generateData()
        
        const option = {
          title: {
            text: 'Edge Drop(μm)',
            left: 'center'
          },
          tooltip: {},
          visualMap: {
            show: true,
            min: 2.5,
            max: 3.5,
            dimension: 2,
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
                     '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
          },
          grid3D: {
            viewControl: {
              projection: 'orthographic',
              autoRotate: false,
              distance: 120,
              alpha: 20,
              beta: 40
            },
            light: {
              main: {
                intensity: 1.2
              },
              ambient: {
                intensity: 0.3
              }
            },
            environment: '#fff'
          },
          xAxis3D: {
            type: 'value',
            name: 'Length(m)',
            min: 0,
            max: 400,
            nameGap: 45
          },
          yAxis3D: {
            type: 'category',
            name: 'Position',
            data: ['WS115', 'WS95', 'WS75', 'CEN', 'OS115', 'OS95', 'OS75'],
            nameGap: 45
          },
          zAxis3D: {
            type: 'value',
            name: 'Thickness(mm)',
            min: 2.5,
            max: 3.5,
            nameGap: 45
          },
          series: [{
            type: 'surface',
            wireframe: {
              show: true,
              lineStyle: {
                color: '#fff',
                width: 0.5,
                opacity: 0.3
              }
            },
            shading: 'realistic',
            data: data
          }]
        }

        this.chart.setOption(option)
        
        window.addEventListener('resize', () => {
          this.chart && this.chart.resize()
        })

      } catch (error) {
        console.error('圖表初始化失敗:', error)
      }
    },

    generateData() {
  const positions = ['WS115', 'WS95', 'WS75', 'CEN', 'OS115', 'OS95', 'OS75']
  const data = []
  
  for (let i = 0; i < 400; i++) {
    for (let j = 0; j < positions.length; j++) {
      const baseValue = 3.0
      const variation = Math.sin(i / 50) * 0.2 + Math.cos(j / 2) * 0.1
      const value = baseValue + variation + Math.random() * 0.1
      data.push([i, j, value])  // [X, Y, Z]
    }
  }
  
  return data
}
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
}

#mainChart {
  border: 1px solid #eee;
}
</style> 
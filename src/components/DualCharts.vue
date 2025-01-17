<template>
  <div class="charts-container">
    <div id="chart1" style="width: 800px; height: 300px;"></div>
    <div id="chart2" style="width: 800px; height: 300px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'DualCharts',
  data() {
    return {
      chart1: null,
      chart2: null
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.chart1 = echarts.init(document.getElementById('chart1'))
      this.chart2 = echarts.init(document.getElementById('chart2'))

      // 共用的基礎配置
      const baseOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              show: true,
              precision: 2
            }
          }
        }
      }

      // 銷售額圖表配置
      const option1 = {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
        },
        yAxis: {
          type: 'value',
          name: '銷售額'
        },
        series: [{
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          name: '產品A',
          smooth: true
        }]
      }

      // 庫存量圖表配置
      const option2 = {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
        },
        yAxis: {
          type: 'value',
          name: '庫存量'
        },
        series: [{
          data: [320, 332, 301, 334, 390, 330, 320],
          type: 'line',
          name: '產品B',
          smooth: true
        }]
      }

      this.chart1.setOption(option1)
      this.chart2.setOption(option2)

      // 監聽第一個圖表的鼠標移動
      this.chart1.getZr().on('mousemove', (params) => {
        const pointInPixel = [params.offsetX, params.offsetY]
        const pointInGrid = this.chart1.convertFromPixel({seriesIndex: 0}, pointInPixel)
        
        if (pointInGrid) {
          const xIndex = Math.round(pointInGrid[0])
          this.chart2.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: xIndex
          })
        }
      })

      // 監聽第二個圖表的鼠標移動
      this.chart2.getZr().on('mousemove', (params) => {
        const pointInPixel = [params.offsetX, params.offsetY]
        const pointInGrid = this.chart2.convertFromPixel({seriesIndex: 0}, pointInPixel)
        
        if (pointInGrid) {
          const xIndex = Math.round(pointInGrid[0])
          this.chart1.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: xIndex
          })
        }
      })

      // 監聽鼠標離開事件
      this.chart1.getZr().on('globalout', () => {
        this.chart2.dispatchAction({
          type: 'hideTip'
        })
      })

      this.chart2.getZr().on('globalout', () => {
        this.chart1.dispatchAction({
          type: 'hideTip'
        })
      })

      // 添加視窗大小改變時的自適應
      window.addEventListener('resize', () => {
        this.chart1 && this.chart1.resize()
        this.chart2 && this.chart2.resize()
      })
    }
  },
  beforeUnmount() {
    if (this.chart1) {
      this.chart1.dispose()
    }
    if (this.chart2) {
      this.chart2.dispose()
    }
  }
}
</script>

<style scoped>
.charts-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
}
</style> 
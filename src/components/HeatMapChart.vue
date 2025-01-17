<template>
  <div class="chart-container">
    <div ref="chartDom" id="mainChart" style="width: 1200px; height: 800px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'HeatMapChart',
  data() {
    return {
      chart: null,
      option: null
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

        const positions = ['WS115', 'WS95', 'WS75', 'CEN', 'OS115', 'OS95', 'OS75']
        const xAxisData = Array.from({length: 400}, (_, i) => i)
        const heatmapData = this.generateHeatmapData(positions.length, 400)
        const lineData = this.generateLineData(400)

        this.option = {
          animation: false,
          title: [{
            text: '入口邊降平面圖',
            left: 'center',
            top: '3%'
          }, {
            text: '厚度變化曲線',
            left: 'center',
            top: '55%'
          }],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              link: {xAxisIndex: 'all'}
            },
            formatter: (params) => {
              let result = `X: ${params[0].axisValue}m<br/>`
              const heatmapData = params.find(p => p.seriesType === 'heatmap')
              if (heatmapData) {
                result += `Y: ${heatmapData.data[1]}<br/>`
                result += `熱力值：${heatmapData.data[2].toFixed(3)}<br/>`
              }
              const lineData = params.find(p => p.seriesType === 'line')
              if (lineData) {
                result += `平均厚度：${lineData.value.toFixed(3)}mm`
              }
              return result
            }
          },
          axisPointer: {
            link: [{
              xAxisIndex: [0, 1]
            }]
          },
          grid: [{
            top: '10%',
            bottom: '55%',
            left: '10%',
            right: '10%',
            containLabel: true
          }, {
            top: '65%',
            bottom: '15%',
            left: '10%',
            right: '10%',
            containLabel: true
          }],
          xAxis: [{
            type: 'category',
            data: xAxisData,
            splitArea: {
              show: true
            },
            axisLabel: {
              formatter: '{value}m',
              interval: 49
            },
            name: 'Length(m)',
            nameLocation: 'middle',
            nameGap: 40,
            gridIndex: 0,
            axisPointer: {
              show: true
            }
          }, {
            type: 'category',
            data: xAxisData,
            position: 'bottom',
            axisLabel: {
              formatter: '{value}m',
              interval: 49
            },
            name: 'Length(m)',
            nameLocation: 'middle',
            nameGap: 40,
            gridIndex: 1,
            axisPointer: {
              show: true
            }
          }],
          yAxis: [{
            type: 'category',
            data: positions,
            splitArea: {
              show: true
            },
            name: 'Position',
            nameLocation: 'middle',
            nameGap: 40,
            gridIndex: 0,
            axisPointer: {
              show: true
            }
          }, {
            type: 'value',
            name: '厚度(mm)',
            nameLocation: 'middle',
            nameGap: 40,
            min: 2.5,
            max: 3.5,
            gridIndex: 1,
            axisPointer: {
              show: true
            }
          }],
          visualMap: {
            min: 2.5,
            max: 3.5,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '5%',
            inRange: {
              color: [
                '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
                '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
              ]
            }
          },
          series: [{
            name: '厚度分布',
            type: 'heatmap',
            data: heatmapData,
            xAxisIndex: 0,
            yAxisIndex: 0,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }, {
            name: '平均厚度',
            type: 'line',
            data: lineData,
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: '#ff4444'
            }
          }]
        }

        this.chart.setOption(this.option)

        this.chart.getZr().on('mousemove', (params) => {
          const pointInPixel = [params.offsetX, params.offsetY]
          try {
            const pointInGrid1 = this.chart.convertFromPixel({gridIndex: 0}, pointInPixel)
            const pointInGrid2 = this.chart.convertFromPixel({gridIndex: 1}, pointInPixel)
            
            let dataIndex = -1
            if (pointInGrid1 && pointInGrid1[0] >= 0) {
              dataIndex = Math.floor(pointInGrid1[0])
            } else if (pointInGrid2 && pointInGrid2[0] >= 0) {
              dataIndex = Math.floor(pointInGrid2[0])
            }

            if (dataIndex >= 0) {
              this.chart.dispatchAction({
                type: 'showTip',
                seriesIndex: [0, 1],
                dataIndex: dataIndex
              })
            }
          } catch (e) {
            this.chart.dispatchAction({
              type: 'hideTip'
            })
          }
        })

        this.chart.getZr().on('globalout', () => {
          this.chart.dispatchAction({
            type: 'hideTip'
          })
        })

        window.addEventListener('resize', this.handleResize)

      } catch (error) {
        console.error('圖表初始化失敗:', error)
      }
    },

    handleMouseMove(params) {
      const pointInPixel = [params.offsetX, params.offsetY]
      try {
        const pointInGrid1 = this.chart.convertFromPixel({gridIndex: 0}, pointInPixel)
        const pointInGrid2 = this.chart.convertFromPixel({gridIndex: 1}, pointInPixel)
        
        if (pointInGrid1 && pointInGrid1[0] >= 0) {
          this.chart.dispatchAction({
            type: 'showTip',
            seriesIndex: [0, 1],
            dataIndex: Math.floor(pointInGrid1[0])
          })
        } else if (pointInGrid2 && pointInGrid2[0] >= 0) {
          this.chart.dispatchAction({
            type: 'showTip',
            seriesIndex: [0, 1],
            dataIndex: Math.floor(pointInGrid2[0])
          })
        }
      } catch (e) {
        this.chart.dispatchAction({
          type: 'hideTip'
        })
      }
    },

    handleMouseOut() {
      this.chart.dispatchAction({
        type: 'hideTip'
      })
    },

    handleResize() {
      this.chart && this.chart.resize()
    },

    generateHeatmapData(yLength, xLength) {
      const data = []
      for (let i = 0; i < xLength; i++) {
        for (let j = 0; j < yLength; j++) {
          const baseValue = 3.0
          const variation = Math.sin(i / 50) * 0.2 + Math.cos(j / 2) * 0.1
          const value = baseValue + variation + Math.random() * 0.1
          data.push([i, j, value])
        }
      }
      return data
    },
    generateLineData(length) {
      return Array.from({length}, (_, i) => {
        const baseValue = 3.0
        const variation = Math.sin(i / 50) * 0.2
        return baseValue + variation + Math.random() * 0.1
      })
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
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
<template>
  <div class="echartsContainer">
    <div class="barEchart">
      <div class="title">柱状图</div>
      <div class="charts">
        <div ref="barChartOne" style="height: 250px; width: 48%;"></div>
        <div ref="barChartTwo" style="height: 250px; width: 48%;"></div>
      </div>
    </div>
    <div class="lineEchart">
      <div class="title">折线图</div>
      <div class="charts">
        <div ref="lineChartOne" style="height: 250px; width: 48%;"></div>
        <div ref="lineChartTwo" style="height: 250px; width: 48%;"></div>
      </div>
    </div>
    <div class="pieEchart">
      <div class="title">饼状图</div>
      <div class="charts">
        <div ref="pieChartOne" style="height: 250px; width: 48%;"></div>
        <div ref="pieChartTwo" style="height: 250px; width: 48%;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, shallowRef, onBeforeUnmount } from 'vue';

// 单系柱状图
const barChartOne = shallowRef<HTMLDivElement | null>(null)

// 多系柱状图
const barChartTwo = shallowRef<HTMLDivElement | null>(null)

// 折线图
const lineChartOne = shallowRef<HTMLDivElement | null>(null)

// 多轴折线图
const lineChartTwo = shallowRef<HTMLDivElement | null>(null)

// 饼图
const pieChartOne = shallowRef<HTMLDivElement | null>(null)

const pieChartTwo = shallowRef<HTMLDivElement | null>(null)

  // 用数组统一管理实例，方便批量resize / dispose
const charts: echarts.ECharts[] = []
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  drawBarOne()
  drawBarTwo()
  drawLineOne()
  drawLineTwo()
  drawPieOne()
  drawPieTwo()

  // 用ResizeObserver监听所有容器
  resizeObserver = new ResizeObserver(() => {
    charts.forEach(c => c.resize())
  })

  const containers = [
    barChartOne.value,
    barChartTwo.value,
    lineChartOne.value,
    lineChartTwo.value,
    pieChartOne.value,
    pieChartTwo.value
  ]

  containers.forEach(el => el && resizeObserver!.observe(el))
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null

  charts.forEach(c => c.dispose())
  charts.length = 0
})

const drawBarOne = () => {
  if (!barChartOne.value) return
  const chart = echarts.init(barChartOne.value)
  charts.push(chart)

  chart.setOption({
    title: {
      text: '单系示例',
      left: 'center',
      top: 0
    },
    tooltip: {},
    legend: {
      left: 'right',
      top: 0,
      data: ['销量']
    },
    grid: {
      top: 40,
      bottom: 10,
      left: 40,
      right: 30,
      containLabel: true
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })

}

const drawBarTwo = () => {
  if (!barChartTwo.value) return
  const chart = echarts.init(barChartTwo.value)
  charts.push(chart)

  chart.setOption({
    title: {
      text: '多系示例',
      left: 'center',
      top: 0
    },
    tooltip: {
      trigger: 'axis' // 多系同时展示
    },
    legend: {
      left: 'right',
      top: 0,
      data: ['销量', '产量']
    },
    grid: {
      top: 40,
      bottom: 10,
      left: 40,
      right: 30,
      containLabel: true
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      },
      {
        name: '产量',
        type: 'bar',
        itemStyle: { color: '#ee6666' },
        data: [10, 20, 40, 10, 20, 25]
      }
    ]

  })
}

const drawLineOne = () => {
  if (!lineChartOne.value) return
  const chart = echarts.init(lineChartOne.value)
  charts.push(chart)

  chart.setOption({
    title: {
      text: '折线示例'
    },
    tooltip: {
      trigger: 'axis',
      // 坐标轴指示器
      axisPointer: {
        type: 'cross', // 十字准星
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Email', 'Video', 'Search', 'Game']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, // 两端不留空隙
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      name: 'h/天',
      nameLocation: 'end'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total', // 堆叠
        areaStyle: {}, // 面积填充
        emphasis: {
          focus: 'series' // 鼠标悬浮的强调效果
        },
        data: [2, 2, 1, 1.5, 3, 1, 0.5]
      },
      {
        name: 'Video',
        type: 'line',
        stack: 'Total', // 堆叠
        areaStyle: {}, // 面积填充
        emphasis: {
          focus: 'series' // 鼠标悬浮的强调效果
        },
        data: [1, 1, 2, 0.5, 3, 3, 4]
      },
      {
        name: 'Game',
        type: 'line',
        stack: 'Total', // 堆叠
        areaStyle: {}, // 面积填充
        emphasis: {
          focus: 'series' // 鼠标悬浮的强调效果
        },
        data: [1, 0.5, 1, 1, 0.5, 4, 4]
      },
      {
        name: 'Search',
        type: 'line',
        stack: 'Total', // 堆叠
        areaStyle: {}, // 面积填充
        emphasis: {
          focus: 'series' // 鼠标悬浮的强调效果
        },
        data: [3, 4, 2, 3, 3, 1, 0.5]
      }
    ]

  })
}

const drawLineTwo = () => {
  if (!lineChartTwo.value) return
  const chart = echarts.init(lineChartTwo.value)
  charts.push(chart)

  chart.setOption({
    title: {
      text: '双轴折线示例'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          background: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Game', 'Video'],
      right: 0,
      top: 20,
      textStyle: {
        fontSize: 12
      }
    },
    // 上下两个十字准星联动
    axisPointer: {
      link: [{ xAxisIndex: 'all' }]
    },
    // 上下两个绘图区域
    grid: [
      { left: 50, right: 30, top: 50, height: '28%' },
      { left: 50, right: 30, top: '58%', height: '28%' }
    ],
    // 两条x轴，各自对应一个grid
    xAxis: [
      {
        type: 'category',
        boundaryGap: false, // 类目轴两端不留白，折线从坐标轴边缘开始
        gridIndex: 0, // 使用第一个grid，数组下标为0
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLabel: {
          show: false // 上面的隐藏x标签，避免和下面重复
        }
      },
      {
        type: 'category',
        boundaryGap: false,
        gridIndex: 1,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    // 两条y轴， 各自对应一个grid
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        name: 'Game(h)',
        nameLocation: 'end',
        nameGap: 10 // 轴名称与轴线末端之间的距离
      },
      {
        type: 'value',
        gridIndex: 1,
        name: 'Video(h)',
        nameLocation: 'end',
        nameGap: 10
        // inverse: true
      }
    ],
    // 每个系列绑定到对应的轴
    series: [
      {
        name: 'Game',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbolSize: 8, // 数据点标记大小
        areaStyle: {}, // 开启面积填充，使用默认样式
        emphasis: { focus: 'series' }, //鼠标悬停时聚焦当前系列，其他系列淡化
        data: [1, 0.5, 1, 1, 0.5, 4, 4]
      },
      {
        name: 'Video',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 8, // 数据点标记大小
        areaStyle: {}, // 开启面积填充，使用默认样式
        emphasis: { focus: 'series' }, //鼠标悬停时聚焦当前系列，其他系列淡化
        data: [1, 1, 2, 0.5, 3, 3, 4]
      }
    ]
  })
}

const drawPieOne = () => {
  if (!pieChartOne.value) return
  const chart = echarts.init(pieChartOne.value)
  charts.push(chart)

  chart.setOption({
    title: {
      text: '圆形饼图示例'
    },
    tooltip: {
      trigger: 'item' // 悬浮到单个数据项
    },
    legend: {
      orient: 'vertical', // 垂直排列
      left: 'left',
      bottom: 0,
      textStyle: {
        fontSize: 12
      },
      itemWidth: 12,
      itemGrap: 0
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 744, name: 'Direct' },
          { value: 356, name: 'Email' },
          { value: 400, name: 'Union Ads' },
          { value: 560, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10, // 阴影模糊程度
            shadowOffsetX: 0, // 阴影水平偏移为 0
            shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
          }
        }
      }
    ]
  })
}

const drawPieTwo = () => {
  if (!pieChartTwo.value) return
  const chart = echarts.init(pieChartTwo.value)
  charts.push(chart)

  chart.setOption({
    title: {
      text: '圆角环形示例'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: {
        fontSize: 12
      },
      itemWidth: 12,
      itemGrap: 0
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['30%', '60%'], // 饼图的半径范围
        avoidLabelOverlap: false, // 避免标签重叠
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  })
}

</script>

<style lang="scss" scoped>
.echartsContainer {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .title {
    font-size: 24px;
    text-align: left;
    padding: 8px;
  }

  .charts {
    display: flex;
  }

  .barEchart,
  .lineEchart,
  .pieEchart {
    min-height: 300px;
    background-color: #ffffff;
    margin-bottom: 12px;
  }

  .pieEchart {
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .charts {
    flex-direction: column;
    // overflow-y: auto;

    >div {
      width: 100% !important;
      height: 200px !important;
    }
  }
}
</style>
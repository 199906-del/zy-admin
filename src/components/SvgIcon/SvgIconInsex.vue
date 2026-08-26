<template>
  <svg :class="svgClass" :width="size" :height="size" :fill="color" aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string, // 图标名称，对应assets/icons/ 下的文件名
  size?: string, // 图标大小
  color?: string, // 图标颜色
  className?: string // 自定义类名
}
// withDefaults表示后面的{}中必须要声明可选属性（加了？的）的默认值
const props = withDefaults(defineProps<Props>(), {
  size: '1em',
  color: 'currentColor',
  className: ''
})

const symbolId = computed(() => `#icon-${props.name}`)

const svgClass = computed(() => {
  const classes = ['svg-icon', props.className]
  return classes.filter(Boolean).join(' ')
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  overflow: hidden;
}
</style>

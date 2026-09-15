<template>
  <div class="icon-gallery">
    <a-card title="拖动更换图标位置">
      <template #extra>
        <a-button type="primary" size="small" @click="resetElements">重置元素位置</a-button>
      </template>
      <div class="scroll_wrap">
        <draggable
          v-model="list"
          item-key="id"
          calss="icon-grid"
          :animation="500"
          tag="ul"
          ghost-class="ghost"
          chosen-class="chosen"
          :delay="200"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          @start="drag = true"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <li class="card-item">
              <SvgIcon :name="element.icon" size="30px" :color="element.color"></SvgIcon>
              <div class="label">第 {{ element.order }}个元素</div>
            </li>
          </template>
        </draggable>
      </div>
      
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import Iconfonts from '@/assets/iconfont/iconfont.json'

interface IconItemType {
  icon: string,
  id: string,
  color: string,
  order: number
}

const STORAGE_KEY = 'icon-draggable-order'
const list = ref<IconItemType[]>([])
const drag = ref(false)

const colors = [
  '#e54d42', '#f37b1d', '#fbbd08', '#8dc63f',
  '#39b54a', '#1cbbb4', '#0081ff', '#6739b6',
  '#9c26b0', '#e03997', '#a5673f', '#8799a3',
]

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)] // 初始化的时候随机取一个颜色

const buildList = (): IconItemType[] => {
  return Iconfonts.glyphs.map((it, index): IconItemType => ({
    icon: it.font_class,
    id: it.icon_id,
    color: getRandomColor(),
    order: index +1
  }))
}

// 清空缓存，重新生成列表。顺序回到原始，颜色重新随机。
const resetElements = () => {
  list.value = buildList()
  localStorage.removeItem(STORAGE_KEY)
}

// 拖拽结束保存
const onDragEnd = () => {
  drag.value = false
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      list.value.map(i => ({ id:i.id, order: i.order, color: i.color}))
    )
  )
}

// 恢复顺序
const restoreOrder = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  const base = buildList()

  if (!raw) {
    list.value = base
    return
  }

  const saved = JSON.parse(raw) as { id: string, order: number, color: string }[]
  const baseMap = new Map(base.map(i => [i.id, i]))
  const restored = saved.map(s => {
    const b = baseMap.get(s.id)
    if (!b) return null
    return { ...b, order: s.order, color: s.color }
  }).filter(Boolean) as IconItemType[]
  const savedSet = new Set(saved.map(s => s.id))
  const rest = base.filter(i => !savedSet.has(i.id))
  list.value = [...restored, ...rest]
}

onMounted(() => {
  restoreOrder()
})
</script>

<style lang="scss" scoped>
.icon-gallery {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.ant-card) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  :deep(.ant-card-body) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding: 10px;
  }

  .scroll_wrap {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;  // iOS 惯性滚动
  }
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  border-top: 1px solid #f5f5f5;
  border-left: 1px solid #f5f5f5;
}
// 中等屏幕
@media (max-width: 1200px) {
  ul { grid-template-columns: repeat(6, 1fr); }
}

// 平板
@media (max-width: 992px) {
  ul { grid-template-columns: repeat(5, 1fr); }
}

// 中等屏幕
@media (max-width: 480px) {
  ul { grid-template-columns: repeat(3, 1fr); }
}

.card-item {
  height: 100px;
  padding: 10px 0;
  text-align: center;
  cursor: move;       // 鼠标变成移动图标，提示可拖拽
  float: left;
  border-right: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.label {
  margin-top: 10px;
  font-size: 14px;
}

@media (max-width: 480px) {
  .card-item {
    height: 84px;
    padding: 6px 0;

    .label {
      font-size: 11px;
      margin-top: 4px;
    }
  }
}

:deep(.svg-icon) {
  transition: transform 0.1s ease-in-out;
}

&:hover :deep(.svg-icon) {
  transform: scale(1.5);
}
</style>
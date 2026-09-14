<template>
  <div class="userManage">
    <div class="left_content">
      <div class="input">
        <a-input v-model:value="searchValue" placeholder="请输入组织名称搜索" allow-clear />
        <a-switch v-model:checked="checked" @change="switchChange" />
      </div>
      <div class="tree-scroll">
        <a-tree :tree-data="filteredTree" :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent"
          :selected-keys="selectedKeys" @expand="onExpand" @select="onSelect">
          <template #title="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substring(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>

    </div>
    <div class="right_content">
      <div class="btnWrap">
        <a-button type="primary" danger @click="handleBatchDelete">删除</a-button>
      </div>
      <div ref="tableWrapRef" class="table_wrapper">
        <a-table :columns="columns" :data-source="userTableData" :pagination="pagination" :scroll="{ y: tableScrollY }"
          :row-selection="rowSelection" row-key="id" @change="handleTableChange">
          <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                <smile-outlined />
                姓名
              </span>
            </template>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status ? 'green' : 'volcano'">{{ record.status ? '正常' : '禁用' }}</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-button danger type="text" @click="handleDelete(record)">删除</a-button>
            </template>
          </template>
        </a-table>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, createVNode, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ExclamationCircleOutlined, SmileOutlined  } from '@ant-design/icons-vue';
import { organization } from '#/modules/Org'
import { userData } from '#/modules/tableData'
import { Modal, message } from 'ant-design-vue'

interface TreeNode {
  title: string
  key: string
  children: TreeNode[]
}

// 树
const treeData = ref<TreeNode[]>(organization as TreeNode[])
const searchValue = ref('')
const expandedKeys = ref<string[]>([])
const autoExpandParent = ref(true)
const selectedKeys = ref<string[]>([])
const checked = ref<boolean>(true)

const filteredTree = computed(() => {
  if (!searchValue.value) return treeData.value
  return filterTree(treeData.value, searchValue.value)
})

// 搜索过滤：保留命中节点及其祖先
const filterTree = (list: TreeNode[], keyword: string): TreeNode[] => {
  const result: TreeNode[] = []
  list.forEach((node) => {
    const children = node.children ? filterTree(node.children, keyword) : []
    const selfHit = node.title.includes(keyword)
    if (selfHit || children.length) {
      result.push({
        ...node,
        // 自身命中——>展示全部子节点，否则只展示命中的子节点
        children: selfHit ? (node.children ?? []) : children
      })
    }
  })
  return result
}

// 收集命中节点的key，用于自动展开
const collectMatchedKeys = (list: TreeNode[], keyword: string): string[] => {
  const keys: string[] = []
  const walk = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.title.includes(keyword)) keys.push(node.key)
      if (node.children?.length) walk(node.children)
    })
  }
  walk(list)
  return keys
}

const collectAllParentKeys = (list: TreeNode[]): string[] => {
  const keys: string[] = []
  const walk = (nodes: TreeNode[]) => {
    nodes.forEach((n) => {
      if (n.children?.length) {
        keys.push(n.key)
        walk(n.children)
      }
    })
  }
  walk(list)
  return keys
}

// 初始化
expandedKeys.value = collectAllParentKeys(treeData.value)

watch(searchValue, (val) => {
  if (!val) {
    expandedKeys.value = []
    autoExpandParent.value = true
    return
  }
  expandedKeys.value = collectMatchedKeys(treeData.value, val)
  autoExpandParent.value = true
})

const onExpand = (keys: string[]) => {
  expandedKeys.value = keys
  autoExpandParent.value = false
}

const onSelect = (keys: string[]) => {
  selectedKeys.value = keys
}

const switchChange = (val: boolean) => {
  if (val) {
    expandedKeys.value = collectAllParentKeys(filteredTree.value)
  } else {
    expandedKeys.value = []
  }
}

// 表格
const sourceData = ref([...userData])
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex'
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const userTableData = computed(() => {
  if (!selectedKeys.value.length) return sourceData.value
  const key = selectedKeys.value[0]
  return sourceData.value.filter(u => u.orgKey === key)
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['5', '10', '20', '50']
})

const handleTableChange = (page: any) => {
  pagination.current = page.current
  pagination.pageSize = page.pageSize
  nextTick(calcHeight)
}

// 动态高度
const tableWrapRef = ref<HTMLElement | null>(null)
const tableScrollY = ref<number>(400)
let ro: ResizeObserver | null = null

const calcHeight = () => {
  if (!tableWrapRef.value) return
  // 直接测量 wrapper 内部真实高度
  const wrapH = tableWrapRef.value.clientHeight

  // 表头高度
  const headerEl = tableWrapRef.value.querySelector('.ant-table-header') as HTMLElement | null
  const headerH = headerEl?.offsetHeight ?? 55

  // 分页器高度
  const paginationEl = tableWrapRef.value.querySelector('.ant-pagination') as HTMLElement | null
  const paginationH = paginationEl?.offsetHeight ?? 64

  const y = wrapH - headerH - paginationH - 18 // 8 是余量，防止刚好溢出
  tableScrollY.value = Math.max(y, 150)
}

// 数据变化——>同步total，回到第一页
watch(userTableData, (val) => {
  pagination.total = val.length
  pagination.current = 1
  // 数据变化后重新计算高度
  nextTick(calcHeight)
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  calcHeight()
  if (tableWrapRef.value) {
    ro = new ResizeObserver(() => calcHeight())
    ro.observe(tableWrapRef.value)
  }
  // 兜底：窗口 resize 也触发一次（ResizeObserver 有时在极端情况下不触发）
  window.addEventListener('resize', calcHeight)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
  window.removeEventListener('resize', calcHeight)
})


// 删除
const selectedRowKeys = ref<(string | number)[]>([])
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[]) => {
    selectedRowKeys.value = keys
  }
}))

const handleDelete = (row: any) => {
  Modal.confirm({
    title: '确认删除',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认删除该用户吗？',
    okText: '删除',
    cancelText: '取消',
    centered: true, 
    onOk() {
      sourceData.value = sourceData.value.filter((item: any) => item.id !== row.id)
      message.success('删除成功')
    }
  })
}

const handleBatchDelete = () => {
  if (!selectedRowKeys.value.length) {
    message.warning('请先选择要删除的数据')
    return
  }
  Modal.confirm({
    title: '确认删除',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定删除选中的用户吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    centered: true, 
    onOk() {
      sourceData.value = sourceData.value.filter(
        (item: any) => !selectedRowKeys.value.includes(item.id)
      )
      selectedRowKeys.value = []
      message.success('删除成功')
    }
  })
}

</script>

<style lang="scss" scoped>
.userManage {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;

  .left_content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
    width: 20%;
    padding: 8px;
    background-color: #ffffff;

    .input {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 8px;
      flex-shrink: 0;
    }

    .tree-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .right_content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 24px;
    margin-left: 16px;
    background-color: #ffffff;
    overflow: hidden;
    min-height: 0;
    
    .btnWrap {
      display: flex;
      margin-bottom: 24px;
      justify-content: flex-end
    }

    .table_wrapper {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
  }
}
</style>

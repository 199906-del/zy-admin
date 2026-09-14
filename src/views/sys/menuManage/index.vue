<template>
  <div class="menuManage" ref="tableWrapRef">
    <a-table row-key="id" :columns="columns" :data-source="tableList" :scroll="{ x: 900, y: tableScrollY }" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'resourceType'">
          <span>{{ record.resourceType === 'folder' ? '目录' : record.resourceType === 'menu' ? '菜单' : '按钮' }}</span>
        </template>
        <template v-if="column.key === 'display'">
          <span>{{ record.display ? '是' : '否' }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-button v-if="record.resourceType !== 'button'" type="text" size="small" style="color: blue" @click="addMenu(record)">新增</a-button>
          <a-button type="text" size="small" style="color: blue" @click="editMenu(record)">编辑</a-button>
          <a-button danger type="text" size="small" @click="deleteMenu(record)">删除</a-button>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="open" centered :title="title" :mask-closable="false" ok-text="确认" cancel-text="取消" @ok="confirm" @cancel="cancel">
      <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item ref="name" label="菜单名称" name="name">
          <a-input v-model:value="formState.name"></a-input>
        </a-form-item>
        <a-form-item ref="resourceType" label="类型" name="resourceType">
          <a-select v-model:value="formState.resourceType">
            <a-select-option value="folder">目录</a-select-option>
            <a-select-option value="menu">菜单</a-select-option>
            <a-select-option value="button">按钮</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item ref="parentId" label="上级菜单" name="parentId">
          <a-tree-select
            v-model:value="formState.parentId"
            :tree-data="parentMenuOptions"
            placeholder="请选择上级菜单"
            allow-clear
            tree-default-expand-all
            :field-names="{label: 'name', value: 'id', children: 'children'}"
          ></a-tree-select>
        </a-form-item>
        <a-form-item ref="orderStr" label="显示排序" name="orderStr">
          <a-input-number id="inputNumber" style="width: 100%" v-model:value="formState.orderStr" :min="1" />
        </a-form-item>
        <a-form-item ref="routePath" label="路由地址" name="routePath">
          <a-input v-model:value="formState.routePath"></a-input>
        </a-form-item>
        <a-form-item ref="isDisplay" label="是否显示" name="isDisplay">
          <a-switch v-model:checked="formState.isDisplay" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onBeforeUnmount, reactive, createVNode } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { adminRouterLists, userRouterLists } from '#/modules/resourceList'

interface ResourceItem {
  id: number,
  name: string,
  route?: string,
  display: boolean,
  resourceType: string,
  icon?: string,
  orderStr: number,
  children?: ResourceItem[]
}

interface FormState {
  name: string,
  resourceType: string,
  parentId: number | null,
  orderStr: number,
  routePath: string,
  isDisplay: boolean
}

interface MenuTreeNode {
  name: string,
  id: number,
  disabled?: boolean,
  children?: MenuTreeNode[]
}

const { username } = JSON.parse(localStorage.getItem('userInfo') || '{}')
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
const treeData = ref<ResourceItem[]>(
  deepClone(username === 'admin' ? adminRouterLists : userRouterLists)
)
const tableList = computed(() => sortByOrder(treeData.value))
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '类型',
    dataIndex: 'resourceType',
    key: 'resourceType'
  },
  {
    title: '排序',
    dataIndex: 'orderStr',
    key: 'orderStr'
  },
  {
    title: '菜单地址',
    dataIndex: 'route',
    key: 'route'
  },
  {
    title: '是否显示',
    dataIndex: 'display',
    key: 'display'
  },
  {
    title: '权限标识',
    dataIndex: 'permissionFlag',
    key: 'permissionFlag'
  },
  {
    title: '操作',
    key: 'action'
  }
]
const open = ref<boolean>(false)
const title = ref<string>('')

const labelCol = { span: 5 }
const wrapperCol = { span: 19 }

const formState: UnwrapRef<FormState> = reactive({
  name: '',
  resourceType: 'folder',
  parentId: null,
  orderStr: 1,
  routePath: '',
  isDisplay: true
})

const formRef = ref()
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'change'},
    { max: 50, message: '长度不超过50', trigger: 'change'}
  ],
  routePath: [
    { required: true, message: '请输入菜路由地址', trigger: 'change'}
  ]
}

const editingId = ref<number | null>(null) // 当前编辑的节点id
// 收集某个节点的所有子孙id
const collectDescendantIds = (node: ResourceItem): number[] => {
  const ids: number[] = []
  const walk = (n: ResourceItem) => {
    n.children?.forEach((c) => {
      ids.push(c.id)
      walk(c)
    })
  }
  walk(node)
  return ids
}

const findNode = (list: ResourceItem[], id: number): ResourceItem | null => {
  for (const n of list) {
    if (n.id === id) return n
    if (n.children?.length) {
      const found = findNode(n.children, id)
      if (found) return found
    }
  }
  return null
}

const parentMenuOptions = computed<MenuTreeNode[]>(() => {
 const excludeIds: number[] = []
 if (editingId.value != null) {
  const node = findNode(tableList.value, editingId.value)
  if (node) {
    excludeIds.push(node.id, ...collectDescendantIds(node))
  }
 }
return buildTreeOptions(tableList.value, excludeIds)
})

// 递归构建树形选项：过滤 button + 标记 disabled
const buildTreeOptions = (list: ResourceItem[], excludeIds: number[]): MenuTreeNode[] => {
  return list
    .filter((n) => n.resourceType !== 'button')   // 按钮不能当父级
    .map((n) => ({
      id: n.id,
      name: n.name,
      disabled: excludeIds.includes(n.id),        // 自己/子孙禁选
      children: n.children?.length ? buildTreeOptions(n.children, excludeIds) : undefined
    }))
}

const sortByOrder = (list: ResourceItem[]): ResourceItem[] => {
  return [...list].sort((a, b) => (a.orderStr ?? 0) - (b.orderStr ?? 0)).map((item) => ({
    ...item,
    children: item.children?.length ? sortByOrder(item.children) : item.children
  }))
}

// 找某节点的父 id
const findParentId = (list: ResourceItem[], id: number, parentId: number | null = null): number | null => {
  for (const n of list) {
    if (n.id === id) return parentId
    if (n.children?.length) {
      const found = findParentId(n.children, id, n.id)
      if (found !== undefined) return found
    }
  }
  return null
}

// 从树中摘除节点，返回被摘除的节点（找不到返回 null）
const detachNode = (list: ResourceItem[], id: number): ResourceItem | null => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list.splice(i, 1)[0]
    }
    if (list[i].children?.length) {
      const found = detachNode(list[i].children!, id)
      if (found) return found
    }
  }
  return null
}

// 把节点挂到指定父节点下；parentId 为 null 时挂到根
const attachNode = (node: ResourceItem, parentId: number | null) => {
  if (parentId == null) {
    treeData.value.push(node)
    return
  }
  const parent = findNode(treeData.value, parentId)
  if (!parent) return
  if (!parent.children) parent.children = []
  parent.children.push(node)
}

// 生成唯一 id
const genId = () => Date.now() + Math.floor(Math.random() * 1000)

const makeRoomForOrder = (parentId: number | null, newOrder: number) => {
  const siblings = parentId == null ? treeData.value : findNode(treeData.value, parentId)?.children ?? []
  const sorted = [...siblings].sort((a, b) => (a.orderStr ?? 0) - (b.orderStr ?? 0))
  let nextAvailabel = newOrder + 1
  for (const n of sorted) {
    const cur = n.orderStr ?? 0
    if (cur < newOrder) continue // 新增之前的不动
    if (cur < nextAvailabel) {
      n.orderStr = nextAvailabel // 被占了顺延
    }
    nextAvailabel = n.orderStr + 1
  }
}

const addMenu = (row: ResourceItem) => {
  title.value = '新增'
  editingId.value = null
  // 如果是点某行的，默认上级就是这个节点
  Object.assign(formState, {
    name: '',
    resourceType: row.resourceType === 'menu' ? 'button' : 'menu',
    parentId: row.id,
    orderStr: 1,
    routePath: '',
    isDisplay: true
  })
  open.value = true
}

const editMenu = (row: ResourceItem) => {
  title.value = '编辑'
  editingId.value = row.id
  Object.assign(formState, {
    name: row.name,
    resourceType: row.resourceType,
    parentId: findParentId(tableList.value, row.id),  // 回填父 id
    orderStr: row.orderStr ?? 1,
    routePath: row.route ?? '',
    isDisplay: row.display
  })
  open.value = true
}

const deleteMenu = (row: ResourceItem) => {
  Modal.confirm({
    title: '确认删除',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定删除选中的用户吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    centered: true, 
    onOk() {
      const node = detachNode(treeData.value, row.id)
      if (node) message.success('删除成功')
    }
  })
}

const confirm = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  // 组装数据
  const payload = {
    name: formState.name,
    resourceType: formState.resourceType,
    orderStr: formState.orderStr,
    route: formState.routePath,      // routePath → route
    display: formState.isDisplay     // isDisplay → display
  }
  if (editingId.value == null) {
    // 新增
    makeRoomForOrder(formState.parentId, formState.orderStr)
    const newNode: ResourceItem = {
      id: genId(),
      ...payload,
      children: undefined
    }
    attachNode(newNode, formState.parentId)
    message.success('新增成功')
  } else {
    // 编辑
    // 先把节点从原位置摘下来
    const node = detachNode(treeData.value, editingId.value)
    if (node) {
      makeRoomForOrder(formState.parentId, formState.orderStr)
      // 更新字段
      Object.assign(node, payload)
      // 重新挂到父节点上
      attachNode(node, formState.parentId)
      message.success('编辑成功')
    }
  }
  open.value = false
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

const cancel = () => {
  open.value = false
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

// 动态高度
const tableScrollY = ref<number>(400)
const tableWrapRef = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

const calcHeight = () => {
  if (!tableWrapRef.value) return
  const WrapH = tableWrapRef.value.clientHeight
  const headerEl = tableWrapRef.value.querySelector('.ant-table-header') as HTMLElement | null
  const headerH = headerEl?.offsetHeight ?? 55

  const y = WrapH - headerH - 18
  tableScrollY.value = Math.max(y, 150)
}

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
</script>

<style scoped>
.menuManage {
  height: 100%;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #ffffff;
}
</style>
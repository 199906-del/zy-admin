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
        <a-button type="primary" v-permission="'新建用户'" @click="addUser">新建用户</a-button>
        <a-button type="primary" danger @click="handleBatchDelete">删除</a-button>
      </div>
      <div ref="tableWrapRef" class="table_wrapper">
        <a-table :columns="columns" :data-source="userTableData" :pagination="pagination"
          :scroll="{ x: 900, y: tableScrollY }" :row-selection="rowSelection" row-key="id" @change="handleTableChange">
          <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                <smile-outlined />
                姓名
              </span>
            </template>
          </template>

          <template #bodyCell="{ column, record }">
            <!-- 性别 -->
            <template v-if="column.key === 'sex'">
              {{ sexMap[record.sex] || record.sex }}
            </template>
            <!-- 角色 -->
            <template v-if="column.key === 'role'">
              {{ roleMap[record.role] || record.role }}
            </template>

            <!-- 组织 -->
            <template v-if="column.key === 'organization'">
              {{ findOrgTitle(treeData, record.organization) }}
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status ? 'green' : 'volcano'">{{ record.status ? '正常' : '禁用' }}</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" @click="editUser(record)">编辑</a-button>
                <a-button danger type="text" @click="handleDelete(record)">删除</a-button>
              </a-space>

            </template>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal v-model:open="addUserOpen" centered :title="dialogTitle" ok-text="确认" cancel-text="取消" @ok="handleOk">
      <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="年龄" name="age">
          <a-input v-model:value="formState.age" />
        </a-form-item>
        <a-form-item label="性别" name="sex">
          <a-select v-model:value="formState.sex">
            <a-select-option value="man">男</a-select-option>
            <a-select-option value="women">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="地址" name="address">
          <a-input v-model:value="formState.address" />
        </a-form-item>
        <a-form-item label="角色" name="role">
          <a-select v-model:value="formState.role">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="superAdmin">超级管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="formState.status" />
        </a-form-item>
        <a-form-item label="组织" name="organization">
          <a-tree-select v-model:value="formState.organization" show-search style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择" allow-clear
            tree-default-expand-all :tree-data="treeData" tree-node-filter-prop="label">
            <template #title="{ title }">
              <span>{{ title }}</span>
            </template></a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, createVNode, onMounted, onBeforeUnmount, nextTick, toRaw } from 'vue'
import { ExclamationCircleOutlined, SmileOutlined } from '@ant-design/icons-vue'
import { organization } from '#/modules/Org'
import { userData } from '#/modules/tableData'
import { Modal, message } from 'ant-design-vue'
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'

interface TreeNode {
  title: string
  key: string
  children: TreeNode[]
}

interface FormState {
  name: string
  age: number | string
  sex: string
  address: string,
  role: string
  status: boolean,
  organization: string
}

// 表单
const dialogTitle = ref<string>('')
// 弹窗模式：'add' | 'edit'
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref()
const labelCol = { style: { width: '150px' } }
const wrapperCol = { span: 12 }
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  age: '',
  sex: '',
  address: '',
  role: '',
  status: true,
  organization: ''
})

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  organization: [{ required: true, message: '请选择组织', trigger: 'change' }]
}

// 树
const normalizeTreeData = (list: any[]): any[] => {
  return list.map((node) => ({
    ...node,
    value: node.value ?? node.key,   // 没有 value 就用 key
    children: node.children ? normalizeTreeData(node.children) : undefined
  }))
}
const treeData = ref<TreeNode[]>(normalizeTreeData(organization))
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
// 性别映射
const sexMap: Record<string, string> = {
  man: '男',
  women: '女'
}

// 角色映射
const roleMap: Record<string, string> = {
  user: '普通用户',
  admin: '管理员',
  superAdmin: '超级管理员'
}

// 递归查找组织名称
const findOrgTitle = (list: any[], key: string): string => {
  for (const node of list) {
    if (node.key === key) return node.title
    if (node.children?.length) {
      const t = findOrgTitle(node.children, key)
      if (t) return t
    }
  }
  return key   // 找不到就原样返回
}

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
    title: '组织',
    dataIndex: 'organization',
    key: 'organization'
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

// 新建用户
const addUserOpen = ref<boolean>(false)
const addUser = () => {
  dialogMode.value = 'add'
  dialogTitle.value = '新建用户'
  resetForm()
  addUserOpen.value = true
}

const editingId = ref<number | null>(null)
const handleOk = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  const payload = {
    name: formState.name,
    age: Number(formState.age),
    sex: formState.sex,
    address: formState.address,
    role: formState.role,
    status: formState.status ? 1 : 0,
    organization: formState.organization,
    orgKey: formState.organization
  }

  if (dialogMode.value === 'add') {
    // 新增：生成 id，插入到最前
    sourceData.value = [{ id: Date.now(), ...payload }, ...sourceData.value]
    message.success('新建成功')
  } else {
    // 编辑：找到对应项并替换
    sourceData.value = sourceData.value.map((item: any) =>
      item.id === editingId.value ? { ...item, ...payload } : item
    )
    message.success('编辑成功')
  }

  addUserOpen.value = false
  resetForm()
}

const editUser = (row: any) => {
  dialogMode.value = 'edit'
  dialogTitle.value = '编辑用户'
  editingId.value = row.id
  // 回填数据
  formState.name = row.name
  formState.age = row.age
  formState.sex = row.sex
  formState.address = row.address
  formState.role = row.role
  formState.status = !!row.status        // 0/1 → boolean
  formState.organization = row.orgKey
  formRef.value?.clearValidate?.()
  addUserOpen.value = true
}

// 重置表单
const resetForm = () => {
  formState.name = ''
  formState.age = ''
  formState.sex = ''
  formState.address = ''
  formState.role = ''
  formState.status = true
  formState.organization = ''
  editingId.value = null
  formRef.value?.clearValidate?.()
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
  box-sizing: border-box;
  overflow: hidden;

  .left_content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
    width: 220px;
    padding: 8px;
    background-color: #ffffff;
    transition: width 0.3s;

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
    min-width: 0;
    padding: 24px;
    margin-left: 16px;
    background-color: #ffffff;
    overflow: hidden;
    min-height: 0;

    .btnWrap {
      display: flex;
      margin-bottom: 24px;
      justify-content: space-between
    }

    .table_wrapper {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
  }
}

@media (max-width: 768px) {
  .userManage {
    flex-direction: column;
    overflow-y: auto;

    .left_content {
      width: 100%;
      max-height: 200px;
      margin-bottom: 12px;
      flex-shrink: 0;
    }

    .right_content {
      margin-left: 0;
      padding: 16px;
      flex: 1;
      min-width: 0;
    }
  }
}
</style>

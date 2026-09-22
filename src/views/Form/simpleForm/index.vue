<template>
  <div class="container">
    <div :class="['item']">
      <div class="title">表单三种布局</div>
      <a-divider />
      <div class="btnLists">
        <a-button class="btn" type="primary" size="small" @click="lineForm">水平</a-button>
        <a-button class="btn" type="primary" size="small" @click="verticalForm">垂直</a-button>
        <a-button class="btn" type="primary" size="small" @click="inlineForm">行内</a-button>
      </div>
      <div class="form">
        <a-form :layout="formState.layout" :model="formState" v-bind="formItemLayout">
          <a-form-item label="Field A">
            <a-input v-model:value="formState.fieldA" placeholder="input placeholder" />
          </a-form-item>
          <a-form-item label="Field B">
            <a-input v-model:value="formState.fieldB" placeholder="input placeholder" />
          </a-form-item>
        </a-form>
      </div>
      <div style="margin-top: 20px">
        <a-button type="primary" @click="onSubmit">提交</a-button>
        <a-button style="margin-left: 10px">取消</a-button>
      </div>
    </div>
    <div :class="['item']">
      <div class="title">表单禁用</div>
      <a-divider />
      <div class="btnLists">
        <a-button class="btn" type="primary" size="small" @click="allDisabled = true">禁用</a-button>
        <a-button class="btn" type="primary" size="small" @click="allDisabled = false">取消禁用</a-button>
      </div>
      <div class="form">
        <a-form :disabled="allDisabled" :model=lineFormData :label-col="labelCol" :wrapper-col="wrapperCol"
          label-align="right">
          <a-form-item label="活动名称">
            <a-input v-model:value="lineFormData.name"></a-input>
          </a-form-item>
          <a-form-item label="活动区域">
            <a-select v-model:value="lineFormData.region">
              <a-select-option value="online">区域一</a-select-option>
              <a-select-option value="offline">区域二</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="活动时间">
            <a-range-picker v-model:value="lineFormData.time" />
          </a-form-item>
          <a-form-item label="是否预约">
            <a-switch v-model:checked="lineFormData.appointment"></a-switch>
          </a-form-item>
          <a-form-item label="活动性质">
            <a-checkbox-group v-model:value="lineFormData.type" class="checkbox-group">
              <a-checkbox value="1" name="type">美食/餐厅线上活动</a-checkbox>
              <a-checkbox value="2" name="type">地推活动</a-checkbox>
              <a-checkbox value="3" name="type">线下主题活动</a-checkbox>
              <a-checkbox value="4" name="type">单纯品牌曝光</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="线上/线下">
            <a-radio-group v-model:value="lineFormData.form">
              <a-radio value="1">线上</a-radio>
              <a-radio value="2">线下</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="其他补充">
            <a-textarea v-model:value="lineFormData.desc"></a-textarea>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 14 }">
            <a-button type="primary" @click="onSubmit">提交</a-button>
            <a-button style="margin-left: 10px">取消</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div :class="['item']">
      <div class="title">动态增减表单项</div>
      <a-divider />
      <div class="form">
        <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateFormOne">
          <a-form-item name="name" label="活动名字">
            <a-input v-model:value="dynamicValidateFormOne.name"></a-input>
          </a-form-item>
          <a-space
            v-for="(user, index) in dynamicValidateFormOne.users"
            :key="index"
            style="display: flex; margin-bottom: 8px"
            align="baseline"
          >
            <a-form-item :name="['users', index, 'name']" label="姓名">
              <a-input v-model:value="user.name"></a-input>
            </a-form-item>
            <a-form-item :name="['users', index, 'age']" label="年龄">
              <a-input v-model:value="user.age"></a-input>
            </a-form-item>
            <MinusCircleOutlined @click="removeUser(user, 0)" />
          </a-space>
          <a-form-item>
            <a-button type="dashed" block @click="addUser(0)">
              <PlusOutlined />
              Add Users
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSubmit">提交</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div :class="['item']">
      <div class="title">动态增减嵌套字段（数组绑定）</div>
      <a-divider />
      <div class="form">
        <a-form :model="dynamicValidateFormTwo">
          <a-space
            v-for="(user, index) in dynamicValidateFormTwo.users"
            :key="index"
            style="display: flex; margin-bottom: 8px"
            align="baseline"
          >
            <a-form-item :name="['users', index, 'name']" label="姓名">
              <a-input v-model:value="user.name"></a-input>
            </a-form-item>
            <a-form-item :name="['users', index, 'age']" label="年龄">
              <a-input v-model:value="user.age"></a-input>
            </a-form-item>
            <MinusCircleOutlined @click="removeUser(user, 1)" />
          </a-space>
          <a-form-item>
            <a-button type="dashed" block @click="addUser(1)">
              <PlusOutlined />
              Add Users
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSubmit">提交</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';

interface FormState {
  layout: 'horizontal' | 'vertical' | 'inline';
  fieldA: string;
  fieldB: string;
}

interface lineFormState {
  name: string
  region: string | undefined
  time: [string, string]
  appointment: boolean
  type: string[]
  form: string
  desc: string
}

interface Users {
  name: string;
  age: string;
}

const labelCol = { span: 6 }
const wrapperCol = { span: 16 }
const allDisabled = ref(false)

const formState: UnwrapRef<FormState> = reactive({
  layout: 'horizontal',
  fieldA: '',
  fieldB: ''
})

const formItemLayout = computed(() => {
  const { layout } = formState
  return layout === 'horizontal' ? {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
  } : {}
})

const lineForm = () => {
  formState.layout = 'horizontal'
}

const verticalForm = () => {
  formState.layout = 'vertical'
}

const inlineForm = () => {
  formState.layout = 'inline'
}

const lineFormData: UnwrapRef<lineFormState> = reactive({
  name: '',
  region: '',
  time: ['', ''],
  appointment: true,
  type: [],
  form: '',
  desc: ''
})

const onSubmit = () => {
  message.success('提交成功')
}

const dynamicValidateFormOne = reactive<{ users: Users[]; name: string | undefined }>({
  users: [],
  name: undefined
})

const removeUser = (item: Users, flag: number) => {
  if (flag) {
    const index = dynamicValidateFormTwo.users.indexOf(item)
    if (index !== -1) {
      dynamicValidateFormTwo.users.splice(index, 1)
    }
  } else {
    const index = dynamicValidateFormOne.users.indexOf(item)
    if (index !== -1) {
      dynamicValidateFormOne.users.splice(index, 1)
    }
  }
}

const addUser = (flag: number) => {
  if (flag) {
    dynamicValidateFormTwo.users.push({
      name: '',
      age: ''
    })
  } else {
    dynamicValidateFormOne.users.push({
      name: '',
      age: ''
    })
  }
  
}

const dynamicValidateFormTwo = reactive<{ users: Users[] }>({
  users: []
})

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  // background-color: #ffffff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;  // iOS 惯性滚动
  box-sizing: border-box;

  .btnLists {
    margin-bottom: 8px;
    display: flex;
    justify-content: end;

    .btn {
      margin-right: 8px;
    }
  }

  .item {
    background-color: #ffffff;
    margin: 12px;
    padding: 8px;

    .form {
      max-width: 400px;
      margin: 0 auto;

      &:has(.ant-form-inline) {
        max-width: 100%;
      }

      :deep(.ant-form-item-control-input-content) {
        display: flex;
        justify-content: flex-start; // 控件在 wrapper 内靠左
      }

      .checkbox-group {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr)); // 两列等宽
        gap: 8px 52px; // 行间距 8px，列间距 16px
        width: 100%;

        :deep(.ant-checkbox-wrapper) {
          margin-inline-start: 0; // 去掉默认左间距
          align-items: flex-start; // 方框贴第一行文字
          line-height: 22px;
        }
      }
    }
  }

  .title {
    font-size: 14px;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .container {
    display: flex;
    flex-direction: column;
  }

  .item .form {
    max-width: 100%;

    // 水平布局：label和控件保持同一行,覆盖antd575断点
    :deep(.ant-form-horizontal) {
      .ant-form-item {
        flex-wrap: nowrap;
      }

      .ant-form-item-label,
      .ant-form-item-control {
        flex: none;
        margin-right: 10px;
        max-width: none;
      }
      .ant-form-item-control-input {
        min-width: 0;
      }

      // 让控件填满剩余空间
      .ant-form-item-control {
        flex: 1;
      }
    }

    // 行内布局：表单项不换行
    :deep(.ant-form-inline) {
      flex-wrap: nowrap;
      overflow-x: auto;

      .ant-form-item-label,
      .ant-form-item-control {
        flex: none;
        max-width: none;
        margin-right: 10px;
      }

      .ant-form-item {
        gap: 8px;
      }
    }
  }
}
</style>
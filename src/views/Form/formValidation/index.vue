<template>
  <div class="container">
    <div class="item">
      <div class="title">表单验证</div>
      <a-divider />
      <div class="form">
        <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item name="name" label="活动名字">
            <a-input v-model:value="formState.name"></a-input>
          </a-form-item>

          <a-form-item name="region" label="活动区域">
            <a-select v-model:value="formState.region">
              <a-select-option value="online">区域一</a-select-option>
              <a-select-option value="offline">区域二</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="time" label="活动时间">
            <a-range-picker v-model:value="formState.time" />
          </a-form-item>
          <a-form-item label="是否预约">
            <a-switch v-model:checked="formState.appointment"></a-switch>
          </a-form-item>
          <a-form-item name="type" label="活动性质">
            <a-checkbox-group v-model:value="formState.type" class="checkbox-group">
              <a-checkbox value="1" name="type">美食/餐厅线上活动</a-checkbox>
              <a-checkbox value="2" name="type">地推活动</a-checkbox>
              <a-checkbox value="3" name="type">线下主题活动</a-checkbox>
              <a-checkbox value="4" name="type">单纯品牌曝光</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item name="form" label="线上/线下">
            <a-radio-group v-model:value="formState.form">
              <a-radio value="1">线上</a-radio>
              <a-radio value="2">线下</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="desc" label="其他补充">
            <a-textarea v-model:value="formState.desc"></a-textarea>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 14 }">
            <a-button type="primary" @click="onSubmit(1)">提交</a-button>
            <a-button style="margin-left: 10px" @click="reset(1)">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="item">
      <div class="title">自定义表单验证(validator)</div>
      <a-divider />
      <div class="form">
        <a-form ref="formRefSelf" name="custom-validation" :model="selfFormState" :rules="selfRules"
          :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item has-feedback label="账号" name="account">
            <a-input v-model:value="selfFormState.account"></a-input>
          </a-form-item>
          <a-form-item has-feedback label="密码" name="pass">
            <a-input v-model:value="selfFormState.pass" type="password" autocomplete="off"></a-input>
          </a-form-item>
          <a-form-item has-feedback label="确认密码" name="checkPass">
            <a-input v-model:value="selfFormState.checkPass" type="password" autocomplete="off" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 14 }">
            <a-button type="primary" @click="onSubmit(0)">提交</a-button>
            <a-button style="margin-left: 10px" @click="reset(0)">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
interface FormState {
  name: string
  region: string | undefined
  time: [string, string]
  appointment: boolean
  type: string[]
  form: string
  desc: string
}
interface SelfFormState {
  account: string
  pass: string
  checkPass: string
}

const formState: UnwrapRef<FormState> = reactive({
  name: '',
  region: '',
  time: ['', ''],
  appointment: true,
  type: [],
  form: '',
  desc: ''
})

const selfFormState: UnwrapRef<SelfFormState> = reactive({
  account: '',
  pass: '',
  checkPass: ''
})
const labelCol = { span: 6 }
const wrapperCol = { span: 16 }
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'change' },
    { min: 3, max: 5, message: '长度3-5之间', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择活动区域', trigger: 'change' }
  ],
  time: [
    { required: true, message: '请选择活动时间', trigger: 'change' }
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: '请选择活动性质',
      trigger: 'change',
    }
  ],
  form: [
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
  desc: [
    { required: true, message: '请输入其他补充', trigger: 'blur' }
  ]
}

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else {
    if (selfFormState.checkPass !== '') {
      formRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
}

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码');
  } else if (value !== selfFormState.pass) {
    return Promise.reject("两次密码不一致");
  } else {
    return Promise.resolve();
  }
}

const selfRules: Record<string, Rule[]> = {
  account: [
    { required: true, message: '请输入账号', trigger: 'change' }
  ],
  pass: [
    { required: true, validator: validatePass, trigger: 'change' }
  ],
  checkPass: [
    { validator: validatePass2, trigger: 'change' }
  ]
}

const formRef = ref()
const formRefSelf = ref()
const onSubmit = async (flag: number) => {
  try {
    if (flag) {
      await formRef.value.validate()
      message.success('提交成功')
      console.log('values', toRaw(formState))
    } else {
      await formRefSelf.value.validate()
      message.success('提交成功')
      console.log('values', toRaw(formState))
    }

  } catch (e) {
    console.log('error', e);
  }
}

const reset = (flag: number) => {
  if (flag) {
    formRef.value.resetFields()
  } else {
    formRefSelf.value.resetFields()
  }
}

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // iOS 惯性滚动
  box-sizing: border-box;

  .title {
    font-size: 16px;
    font-weight: 500;
    padding-top: 5px;
  }

  .item {
    background-color: #ffffff;
    margin: 12px;
    padding: 8px;

    .form {
      max-width: 400px;
      margin: 0 auto;

      :deep(.ant-picker) {
        width: 100%;
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

      .ant-form-item-label {
        min-width: 55px;
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

    .checkbox-group {
      :deep(.ant-checkbox + span) {
        padding-inline-start: 2px; // 默认约 8px，改小就变窄，改大就变宽
        padding-inline-end: 2px; // 默认约 8px，改小就变窄，改大就变宽
      }
    }
  }
}
</style>
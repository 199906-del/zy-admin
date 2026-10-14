<template>
  <div class="container">
    <a-steps :current="current" :items="items"></a-steps>
    <div class="steps-content">
      <div v-if="current === 0">
        <div style="color: #409eff; padding: 10px 0">请填写用户信息</div>
        <div class="Form">
          <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ style: { width: '100px' } }"
            :wrapper-col="{ style: { flex: 'none' } }" label-align="right">
            <a-form-item label="用户名称" name="name">
              <a-input v-model:value="formState.name" placeholder="请输入用户名称" autocomplete="off"
                style="width: 240px"></a-input>
            </a-form-item>
            <a-form-item label="出生年月" name="birthday">
              <a-date-picker v-model:value="formState.birthday" placeholder="请选择出生年月" picker="month"
                :input-props="{ autocomplete: 'off' }" style="width: 240px" />
            </a-form-item>
            <a-form-item label="密码" name="password">
              <a-input v-model:value="formState.password" type="password" placeholder="请输入密码"
                autocomplete="new-password" style="width: 240px"></a-input>
            </a-form-item>
            <a-form-item has-feedback label="确认密码" name="checkPass">
              <a-input v-model:value="formState.checkPass" type="password" autocomplete="new-password"
                style="width: 240px" />
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div v-if="current === 1">
        <a-form ref="phoneFormRef" :model="formPhone" :rules="phoneRule" :label-col="{ style: { width: '200px' } }"
          :wrapper-col="{ style: { flex: 'none' } }" label-align="right">
          <a-form-item label="中国大陆手机号码(+86)" name="phone">
            <div style="position: relative; width: 240px;">
              <a-input v-model:value="formPhone.phone" placeholder="请输入手机号码" :maxlength="11" @input="onPhoneInput"
                style="width: 240px" />
              <a-button type="link" :disabled="countdown > 0"
                style="position: absolute; left: 100%; top: 50%; transform: translateY(-50%); margin-left: 8px; padding: 0; white-space: nowrap;"
                @click="getVali">
                {{ countdown > 0 ? `${countdown}s后重新获取` : '获取验证码' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item label="验证码" name="vali">
            <a-input v-model:value="formPhone.vali" placeholder="请输入验证码" style="width: 240px" />
          </a-form-item>
        </a-form>
      </div>
      <div v-if="current === 2">
        <a-result status="success" title="注册成功">
        </a-result>
      </div>
    </div>
    <div class="steps-action">
      <a-button v-if="current === 0" @click="Reset">重置</a-button>
      <a-button v-if="current > 0 && current < items.length - 1" type="primary" @click="Last">上一步</a-button>
      <a-button v-if="current < items.length - 2" type="primary" @click="Next">下一步</a-button>
      <a-button v-if="current === items.length - 2" type="primary" :loading="iconLoading" @click="Creat">
        注册</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { onUnmounted } from 'vue'
interface FormState {
  name: string
  birthday: string
  password: string
  checkPass: string
}

interface phoneState {
  phone: string | number
  vali: string | number
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

const iconLoading = ref<boolean>(false)

const formState: UnwrapRef<FormState> = reactive({
  name: '',
  birthday: '',
  password: '',
  checkPass: ''
})

const formPhone: UnwrapRef<phoneState> = reactive({
  phone: '',
  vali: ''
})

const formRef = ref()
const phoneFormRef = ref()
const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else {
    if (formState.checkPass !== '') {
      formRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
}

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码');
  } else if (value !== formState.password) {
    return Promise.reject("两次密码不一致");
  } else {
    return Promise.resolve();
  }
}

const onPhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formPhone.phone = target.value.replace(/\D/g, '')
}

// 手机号校验规则
const validatePhone = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入手机号码')
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    return Promise.reject('手机号格式不正确')
  } else {
    return Promise.resolve()
  }
}

const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入用户名称', trigger: 'change' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'change' }
  ],
  checkPass: [
    { validator: validatePass2, trigger: 'change' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'change' }
  ]
}

const phoneRule: Record<string, Rule[]> = {
  phone: [
    { required: true, validator: validatePhone, trigger: 'change' }
  ],
  vali: [
    { required: true, message: '请输入验证码', trigger: ['change', 'blur'] }
  ]
}

const items = [
  {
    title: '请填写用户信息'
  },
  {
    title: '手机验证'
  },
  {
    title: '注册成功'
  }
]
const current = ref<number>(0)

const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
const getVali = async () => {
  await phoneFormRef.value.validate('phone')
  // 倒计时
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
}

const Reset = async () => {
  await nextTick()
  formRef.value.resetFields()
  Object.assign(formState, {
    name: '',
    birthday: null,
    password: '',
    checkPass: ''
  })
}

const Last = () => {
  current.value--
}

const Next = async () => {
  await formRef.value.validate()
  current.value++
}

const Creat = async () => {
  await phoneFormRef.value.validate()
  iconLoading.value = true
  setTimeout(() => {
    iconLoading.value = false
    current.value++
  }, 1000)
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 24px;
  background-color: #ffffff;
  overflow-y: auto;

  .steps-content {
    margin-top: 16px;
    min-height: 200px;
  }

  .steps-action {
    margin-top: 24px;
    display: flex;
    gap: 8px;
  }
}
</style>
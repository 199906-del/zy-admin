import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// 引入Ant Design Vue的基础样式
import 'ant-design-vue/dist/reset.css'
// 引入pinia
import pinia from './store'

// 开发环境引入 mock
if (import.meta.env.DEV) {
  import('../mock');
}

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')


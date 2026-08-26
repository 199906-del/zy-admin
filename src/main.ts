import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// 引入Ant Design Vue的基础样式
import 'ant-design-vue/dist/reset.css'
// 引入pinia
import pinia from './store'
// 导入SVG图标注册
import 'virtual:svg-icons-register'

// 导入SVG图标组件
import SvgIcon from '@/components/SvgIcon/SvgIconInsex.vue'

// 开发环境引入 mock
if (import.meta.env.DEV) {
  import('../mock');
}

const app = createApp(App)
// 全局注册SVG图标组件
app.component('SvgIcon', SvgIcon)

app.use(router)
app.use(pinia)

app.mount('#app')


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入自动导入组件插件
import Components from 'unplugin-vue-components/vite'
// 引入 Ant Design Vue的解析器
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// 引入mock
import { viteMockServe } from 'vite-plugin-mock'

import path from 'path'
import { loadEnv } from 'vite'

const __dirname = import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            // 按需加载样式
            importStyle: false,
            // 如果需要加载图标库，可以开启
            resolveIcons: true
          })
        ]
      }),
      viteMockServe({
        mockPath: 'mock', // mock文件存放目录
        // enable: true, // 是否启用mock
        enable: env.VITE_MOCK === 'true', // 根据env中的配置选择是否开启mock
        logger: true // 控制台显示请求日志
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    server: {
      port: 9527
    }
  }

})

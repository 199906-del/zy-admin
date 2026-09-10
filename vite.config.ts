import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入自动导入组件插件
import Components from 'unplugin-vue-components/vite'
// 引入 Ant Design Vue的解析器
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// 引入mock
import { viteMockServe } from 'vite-plugin-mock'
// 引入svg图标插件createSvgIconsPlugin
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// 产物分析插件，构建后生成可视化图，看每个chunk里有什么
import { visualizer } from 'rollup-plugin-visualizer'

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
      // 只在mode === 'analyze'时启用分析插件(npm run analyze)
      mode === 'analyze' && visualizer({
        open: true, // 构建后自动打开浏览器
        gzipSize: true, // 显示gzip后大小
        brotliSize: true, // 显示brotli后大小
        filename: 'stats.html' // 分析文件输出名
      }),
      viteMockServe({
        mockPath: 'mock', // mock文件存放目录
        // enable: true, // 是否启用mock
        enable: env.VITE_MOCK === 'true', // 根据env中的配置选择是否开启mock
        logger: true // 控制台显示请求日志
      }),
      // svg图标配置
      createSvgIconsPlugin({
        // 指定SVG图标存放目录
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 图标ID格式
        symbolId: 'icon-[name]',
        // 自定义注入位置
        inject: 'body-first',
        // 自定义SVG属性
        customDomId: '__svg__icons__dom__'
      })
    ].filter(Boolean), // 过滤掉 mode !== 'analyze' 时 visualizer 返回的 false
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    server: {
      port: 9527
    },

    build: {
      chunkSizeWarningLimit: 1500, // 某个chunk超过1500KB就警告
      rollupOptions: {
        output: {
           // id 为每个模块的绝对路径，函数返回一个字符串，表示这个模块归到哪个 chunk
          manualChunks(id) {
            if (!id.includes('node_modules')) return // 排除node_modules，表示不手动指定，交给默认逻辑
            // 精准提取包名
            const match = id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/)
            if (!match) return 'vendor'

            const pkg = match[1]
            // 按包名分组
            // Vue 核心,@vue/runtime-core、@vue/shared 等 Vue 内部包都归到 vue-vendor
            if (pkg === 'vue' || pkg.startsWith('@vue/')) return 'vue-vendor'
            // 路由和状态管理也放 vue-vendor
            if (pkg === 'vue-router' || pkg === 'pinia') return 'vue-vendor'
            // VueUse 单独一个 chunk
            if (pkg.startsWith('@vueuse')) return 'vueuse'
            // Ant Design Vue 单独一个 chunk。它体积大（几百 KB），拆出来利于缓存
            if (pkg.startsWith('ant-design-vue')) return 'antd'
            // 图表库单独拆。echarts 体积大（通常 1MB+），必须独立。
            if (pkg.startsWith('echarts')) return 'echarts'
            // 富文本编辑器单独拆。这类库也大，且只在编辑页面用，独立后可按需加载。
            if (pkg.includes('wangeditor') || pkg.includes('quill')) return 'editor'
            return 'vendor'
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }

})

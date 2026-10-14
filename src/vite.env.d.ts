/// <reference types="vite/client" />

// 声明虚拟模块
declare module 'virtual:svg-icons-register' {
  // 这是一个 side-effect 导入，不需要导出任何内容
  const content: any
  export default content
}

// 如果有其他虚拟模块，也可以在这里声明
declare module 'virtual:*' {
  const content: any
  export default content
}
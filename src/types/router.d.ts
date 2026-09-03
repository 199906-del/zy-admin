import 'vue-router'

declare module 'vue-router' {
  // 扩展 RouteMeta 接口（推荐）
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 菜单图标 */
    icon?: string
    /** 是否在菜单中隐藏 */
    hidden?: boolean
    /** 是否需要登录认证 */
    requiresAuth?: boolean
    /** 是否显示工作台 */
    showWorkshop?: boolean
    /** 排序权重 */
    order?: number
    /** 权限标识 */
    permission?: string | string[]
    /** 允许访问的角色 */
    roles?: string[]
    /** 是否缓存页面 */
    keepAlive?: boolean
    /** 是否固定标签 */
    affix?: boolean
    /** 活动菜单路径（用于高亮） */
    activeMenu?: string
  }
}
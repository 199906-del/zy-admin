// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'  // 👈 加上 type 关键字
import LoginView from '../views/login/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/layout/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
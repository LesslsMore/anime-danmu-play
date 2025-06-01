import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Index from '@/components/Index.vue'
import Play from '@/components/Play.vue'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: '/play',
    name: 'Play',
    component: Play
  }
]

const router = createRouter({
//   history: createWebHashHistory(),
    history: createWebHistory(), //路由器的工作模式（稍后讲解）
  routes
})

export default router
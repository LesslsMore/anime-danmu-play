import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Detail from '@/components/Detail.vue'
import Play from '@/components/Play.vue'
import Anime from "../components/Anime.vue";

const routes = [
  {
    path: '/',
    redirect: '/anime'
  },
  {
    path: '/anime',
    name: 'Anime',
    component: Anime
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail
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

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/category/:type',
    name: 'Category',
    component: () => import('../views/Category.vue')
  },
  {
    path: '/artist/:type/:name',
    name: 'Artist',
    component: () => import('../views/Artist.vue')
  },
  {
    path: '/view/:type/:artist/:song/:file',
    name: 'ViewTab',
    component: () => import('../views/ViewTab.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 
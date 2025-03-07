import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  // 默认路由
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { 
      title: 'Guitar Tabs | Online Collection of Fingerstyle & Singing Music'
    }
  },
  // 英语路由
  {
    path: '/en/',
    name: 'HomeEn',
    component: Home,
    meta: { 
      title: 'Guitar Tabs | Online Collection of Fingerstyle & Singing Music',
      locale: 'en'
    }
  },
  // 中文路由
  {
    path: '/zh/',
    name: 'HomeZh',
    component: Home,
    meta: { 
      title: 'Guitar Tabs | Online Collection of Fingerstyle & Singing Music',
      locale: 'zh'
    }
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

// 路由前置守卫，设置标题和语言
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 如果路由指定了语言，则切换语言
  if (to.meta.locale) {
    // 在这里不更改语言，而是在组件中处理
    // Vue 3 中，$i18n 不再直接挂载在 app 实例上
  }
  
  next()
})

export default router 
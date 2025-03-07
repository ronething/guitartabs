import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/index.css'

// 处理GitHub Pages上的重定向
// 如果从404.html重定向过来，恢复原始URL
const redirect = sessionStorage.redirect
delete sessionStorage.redirect
if (redirect && redirect !== location.href) {
  // 检查URL查询参数中是否有redirect
  const url = new URL(location.href)
  const redirectPath = url.searchParams.get('redirect')
  if (redirectPath) {
    history.replaceState(null, null, redirectPath)
  } else if (redirect) {
    history.replaceState(null, null, redirect)
  }
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app') 
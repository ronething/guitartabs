import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

const messages = {
  en,
  zh
}

// 获取默认语言，优先使用路径中的语言标识或浏览器语言
const getDefaultLocale = () => {
  const path = window.location.hash;
  
  // 检查 URL 路径中是否包含语言标识
  if (path.includes('/en/')) return 'en';
  if (path.includes('/zh/')) return 'zh';
  
  // 回退到浏览器语言或默认英语
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'zh' ? 'zh' : 'en';
}

export default createI18n({
  legacy: false, // 使用组合式API
  locale: getDefaultLocale(), // 根据路径或浏览器语言选择默认语言
  fallbackLocale: 'en', // 如果没有对应的语言，回退到英文
  messages
}) 

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="./assets/guitar-icon.svg" alt="Guitar Tabs">
              <router-link to="/" class="ml-2 text-xl font-bold text-gray-900">{{ $t('home.title') }}</router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 语言切换 -->
            <div class="relative inline-block">
              <div 
                @click="toggleLanguageDropdown" 
                class="flex items-center space-x-1 py-2 px-3 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 select-none"
                :class="isLanguageDropdownOpen ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <span class="inline-flex items-center">
                  <span v-if="currentLocale === 'zh'" class="emoji-flag mr-1">🇨🇳</span>
                  <span v-else class="emoji-flag mr-1">🇺🇸</span>
                  <span>{{ currentLocale === 'zh' ? '中文' : 'English' }}</span>
                </span>
                <svg class="h-4 w-4" :class="isLanguageDropdownOpen ? 'transform rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              <!-- 下拉菜单 -->
              <div 
                v-show="isLanguageDropdownOpen" 
                class="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                @click.stop
              >
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <a 
                    href="#" 
                    @click.prevent.stop="changeLocale('en')" 
                    class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                    :class="currentLocale === 'en' ? 'text-blue-600 font-medium' : 'text-gray-700'"
                  >
                    <span class="emoji-flag mr-2">🇺🇸</span>
                    English
                    <svg v-if="currentLocale === 'en'" class="ml-2 h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    @click.prevent.stop="changeLocale('zh')" 
                    class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                    :class="currentLocale === 'zh' ? 'text-blue-600 font-medium' : 'text-gray-700'"
                  >
                    <span class="emoji-flag mr-2">🇨🇳</span>
                    中文
                    <svg v-if="currentLocale === 'zh'" class="ml-2 h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <a href="https://github.com/ronething/guitartabs" target="_blank" class="text-gray-500 hover:text-gray-700">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="bg-white mt-auto py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          {{ $t('home.title') }} &copy; {{ new Date().getFullYear() }}
          <span v-if="lastUpdated" class="ml-2">{{ $t('footer.lastUpdated') }}: {{ formatDate(lastUpdated) }}</span>
          {{ $t('footer.poweredBy') }} <a href="https://www.online-guitartuner.com" target="_blank">Online GuitarTuner</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getLastUpdated } from './utils/guitarTabService';

const router = useRouter();
const { locale } = useI18n();
const lastUpdated = ref(null);
const isLanguageDropdownOpen = ref(false);

// 当前语言
const currentLocale = computed({
  get: () => locale.value,
  set: (value) => { 
    locale.value = value;
    // 保存语言选择到 localStorage
    localStorage.setItem('userLanguage', value);
  }
});

// 切换语言下拉菜单
function toggleLanguageDropdown(event) {
  // 阻止事件冒泡，避免立即触发document的点击事件
  if (event) {
    event.stopPropagation();
  }
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value;
}

// 点击其他区域关闭下拉菜单
function closeDropdownOnOutsideClick(event) {
  // 获取语言切换容器元素
  const languageContainer = document.querySelector('.relative.inline-block');
  
  // 如果下拉菜单打开，且点击事件不在语言切换容器内部，则关闭下拉菜单
  if (isLanguageDropdownOpen.value && languageContainer && !languageContainer.contains(event.target)) {
    isLanguageDropdownOpen.value = false;
  }
}

// 切换语言
function changeLocale(lang) {
  currentLocale.value = lang;
  isLanguageDropdownOpen.value = false;
  
  // 检查当前路径，决定是否需要导航
  const path = router.currentRoute.value.path;
  
  // 如果当前路径中没有语言前缀，且用户希望添加，可以导航
  if (path === '/' && currentLocale.value) {
    const newPath = `/${currentLocale.value}/`;
    router.push(newPath).catch(err => {
      // 处理导航错误
      console.error('Navigation error:', err);
    });
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 获取最后更新时间
onMounted(async () => {
  try {
    lastUpdated.value = await getLastUpdated();
    // 添加点击其他区域关闭下拉菜单的事件监听
    document.addEventListener('click', closeDropdownOnOutsideClick);
  } catch (error) {
    console.error('获取更新时间失败:', error);
  }
});

// 组件卸载时移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});
</script>

<style scoped>
.emoji-flag {
  font-size: 1.2em;
  line-height: 1;
}
</style> 

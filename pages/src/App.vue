<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="./assets/guitar-icon.svg" alt="Guitar Tabs">
              <a href="/" class="ml-2 text-xl font-bold text-gray-900">Guitar Tabs</a>
            </div>
          </div>
          <div class="flex items-center">
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
          Guitar Tabs &copy; {{ new Date().getFullYear() }}
          <span v-if="lastUpdated" class="ml-2">数据更新时间: {{ formatDate(lastUpdated) }}</span>
          Powered by <a href="https://www.online-guitartuner.com" target="_blank">Online GuitarTuner</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getLastUpdated } from './utils/guitarTabService';

const lastUpdated = ref(null);

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
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
  } catch (error) {
    console.error('获取更新时间失败:', error);
  }
});
</script> 

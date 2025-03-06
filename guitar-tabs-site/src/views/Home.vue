<template>
  <div>
    <div class="relative bg-gray-800">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover" src="../assets/guitar-hero.jpg" alt="吉他背景图">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">吉他谱收藏</h1>
        <p class="mt-6 text-xl text-gray-300 max-w-3xl">
          收集整理的吉他谱资源，包括指弹和弹唱曲谱，希望能帮助到热爱吉他的你。
        </p>
      </div>
    </div>

    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div v-if="loading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <div v-else>
          <h2 class="text-3xl font-extrabold text-gray-900">曲谱分类</h2>
          
          <div class="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2">
            <!-- 指弹分类卡片 -->
            <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                    </svg>
                  </div>
                  <div class="ml-5">
                    <h3 class="text-lg font-medium text-gray-900">指弹</h3>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      <span>{{ fingerStyleStats.artists }} 位艺术家</span>
                      <span class="mx-2">•</span>
                      <span>{{ fingerStyleStats.songs }} 首曲目</span>
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <router-link :to="{ name: 'Category', params: { type: 'fingerStyle' }}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    浏览指弹谱
                  </router-link>
                </div>
              </div>
            </div>

            <!-- 弹唱分类卡片 -->
            <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                  </div>
                  <div class="ml-5">
                    <h3 class="text-lg font-medium text-gray-900">弹唱</h3>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      <span>{{ singingStats.artists }} 位艺术家</span>
                      <span class="mx-2">•</span>
                      <span>{{ singingStats.songs }} 首曲目</span>
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <router-link :to="{ name: 'Category', params: { type: 'singing' }}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    浏览弹唱谱
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 最近更新 -->
          <div class="mt-16">
            <h2 class="text-xl font-bold text-gray-900">最近更新</h2>
            <ul class="mt-6 border-t border-gray-200 divide-y divide-gray-200">
              <li v-for="(item, index) in recentUpdates" :key="index" class="py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ item.artist }} - {{ item.song }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ item.category }}
                    </p>
                  </div>
                  <router-link :to="{ name: 'Artist', params: { type: item.type, name: item.artist }}" class="text-sm font-medium text-blue-600 hover:text-blue-500">
                    查看
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { buildGuitarTabsData } from '../utils/guitarTabService'

const loading = ref(true)
const data = ref({
  fingerStyle: { name: '指弹', artists: [] },
  singing: { name: '弹唱', artists: [] }
})

// 统计信息
const fingerStyleStats = computed(() => {
  const artists = data.value.fingerStyle.artists.length
  let songs = 0
  data.value.fingerStyle.artists.forEach(artist => {
    songs += artist.songs.length
  })
  return { artists, songs }
})

const singingStats = computed(() => {
  const artists = data.value.singing.artists.length
  let songs = 0
  data.value.singing.artists.forEach(artist => {
    songs += artist.songs.length
  })
  return { artists, songs }
})

// 最近更新列表（模拟数据）
const recentUpdates = computed(() => {
  const updates = []
  
  // 从指弹中收集一些数据
  data.value.fingerStyle.artists.slice(0, 3).forEach(artist => {
    if (artist.songs.length > 0) {
      updates.push({
        type: 'fingerStyle',
        category: '指弹',
        artist: artist.name,
        song: artist.songs[0].name
      })
    }
  })
  
  // 从弹唱中收集一些数据
  data.value.singing.artists.slice(0, 2).forEach(artist => {
    if (artist.songs.length > 0) {
      updates.push({
        type: 'singing',
        category: '弹唱',
        artist: artist.name,
        song: artist.songs[0].name
      })
    }
  })
  
  return updates.slice(0, 5) // 最多显示5条
})

onMounted(async () => {
  try {
    data.value = await buildGuitarTabsData()
  } catch (error) {
    console.error('加载数据失败', error)
  } finally {
    loading.value = false
  }
})
</script> 
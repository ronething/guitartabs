<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div class="mb-8">
        <div class="flex items-center">
          <router-link 
            :to="{ name: 'Category', params: { type: categoryType }}" 
            class="mr-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            &larr; 返回{{ categoryName }}
          </router-link>
        </div>
        <h1 class="mt-2 text-3xl font-extrabold text-gray-900">{{ artistName }}</h1>
        <p class="mt-2 text-sm text-gray-500">
          {{ songs.length }} 首曲目
        </p>
      </div>

      <!-- 曲目列表 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="song in songs" :key="song.name">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">{{ song.name }}</h3>
                <p class="text-sm text-gray-500">{{ song.files.length }} 个文件</p>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="mt-2 flex flex-col text-sm text-gray-500 sm:mt-0">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="file in song.files" 
                      :key="file.name"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium"
                      :class="getFileTypeClass(file.type)"
                    >
                      <a 
                        :href="file.download_url" 
                        target="_blank" 
                        class="hover:underline"
                      >
                        {{ file.name }}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { buildGuitarTabsData } from '../utils/guitarTabService'

const route = useRoute()
const loading = ref(true)
const data = ref({
  fingerStyle: { name: '指弹', artists: [] },
  singing: { name: '弹唱', artists: [] }
})

// 获取当前分类类型
const categoryType = computed(() => route.params.type)

// 获取分类名称
const categoryName = computed(() => {
  if (categoryType.value === 'fingerStyle') return '指弹'
  if (categoryType.value === 'singing') return '弹唱'
  return ''
})

// 获取艺术家名称
const artistName = computed(() => route.params.name)

// 获取艺术家的曲目列表
const songs = computed(() => {
  if (!data.value[categoryType.value]) return []
  
  const artist = data.value[categoryType.value].artists.find(
    a => a.name === artistName.value
  )
  
  return artist ? artist.songs : []
})

// 根据文件类型返回不同的样式类
const getFileTypeClass = (type) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'bg-red-100 text-red-800'
    case 'md':
      return 'bg-blue-100 text-blue-800'
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    data.value = await buildGuitarTabsData()
  } catch (error) {
    console.error('加载数据失败', error)
  } finally {
    loading.value = false
  }
}

// 监听路由变化，重新加载数据
watch([() => route.params.type, () => route.params.name], () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script> 
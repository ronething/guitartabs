<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">{{ categoryNameI18n }}</h1>
        <p class="mt-2 text-sm text-gray-500">
          {{ $t('category.total') }} {{ artists.length }} {{ $t('category.artists') }}，{{ totalSongs }} {{ $t('category.songs') }}
        </p>
      </div>

      <!-- 艺术家列表 -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="artist in artists" :key="artist.name" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 truncate">{{ artist.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ artist.songs.length }} {{ $t('category.songs') }}</p>
            <div class="mt-4">
              <router-link 
                :to="{ name: 'Artist', params: { type: categoryType, name: artist.name }}" 
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {{ $t('category.viewSongs') }} &rarr;
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { buildGuitarTabsData } from '../utils/guitarTabService'

const route = useRoute()
const { t } = useI18n()
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

// 国际化分类名称
const categoryNameI18n = computed(() => {
  if (categoryType.value === 'fingerStyle') return t('category.fingerstyle')
  if (categoryType.value === 'singing') return t('category.singing')
  return ''
})

// 获取当前分类的艺术家列表
const artists = computed(() => {
  if (!data.value[categoryType.value]) return []
  return data.value[categoryType.value].artists
})

// 计算总曲目数
const totalSongs = computed(() => {
  let count = 0
  artists.value.forEach(artist => {
    count += artist.songs.length
  })
  return count
})

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
watch(() => route.params.type, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script> 
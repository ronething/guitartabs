<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div class="mb-8">
        <div class="flex items-center">
          <router-link 
            :to="{ name: 'Artist', params: { type: categoryType, name: artistName }}" 
            class="mr-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            &larr; {{ $t('viewTab.backTo') }} {{ artistName }}
          </router-link>
        </div>
        <h1 class="mt-2 text-3xl font-extrabold text-gray-900">{{ songName }}</h1>
        <p class="mt-2 text-sm text-gray-500">
          {{ fileName }}
        </p>
      </div>

      <!-- 文件查看器 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <!-- PDF查看器 -->
          <div v-if="fileType === 'pdf'" class="flex flex-col items-center">
            <p class="mb-4 text-gray-500">{{ $t('viewTab.pdfDownload') }}</p>
            <a 
              :href="fileUrl" 
              download
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('viewTab.downloadPdf') }}
            </a>
          </div>

          <!-- 图片查看器 -->
          <div v-else-if="['jpg', 'jpeg', 'png'].includes(fileType)" class="flex justify-center">
            <img :src="fileUrl" :alt="$t('viewTab.imageAlt')" class="max-w-full h-auto" />
          </div>

          <!-- Markdown查看器 -->
          <div v-else-if="fileType === 'md'" class="prose max-w-none">
            <p class="text-gray-500">{{ $t('viewTab.markdownDownload') }}</p>
            <a 
              :href="fileUrl" 
              download
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('viewTab.downloadMarkdown') }}
            </a>
          </div>

          <!-- 其他文件类型 -->
          <div v-else class="text-center">
            <p class="text-gray-500">{{ $t('viewTab.otherFileType') }}</p>
            <a 
              :href="fileUrl" 
              download
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('viewTab.downloadFile') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const loading = ref(true)

// 获取路由参数
const categoryType = computed(() => route.params.type)
const artistName = computed(() => route.params.artist)
const songName = computed(() => route.params.song)
const fileName = computed(() => route.params.file)

// 获取文件类型
const fileType = computed(() => {
  const parts = fileName.value.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
})

// 构建文件URL
const fileUrl = computed(() => {
  const baseUrl = 'https://raw.githubusercontent.com/ronething/guitartabs/master'
  const path = `${categoryType.value}/${encodeURIComponent(artistName.value)}/${encodeURIComponent(songName.value)}/${encodeURIComponent(fileName.value)}`
  return `${baseUrl}/${path}`
})

onMounted(() => {
  // 模拟加载
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script> 
<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <!-- PDF查看器 -->
      <div v-if="fileType === 'pdf'" class="flex flex-col items-center">
        <p class="mb-4 text-gray-500">PDF文件需要下载后查看</p>
        <a 
          :href="fileUrl" 
          download
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          下载PDF文件
        </a>
      </div>

      <!-- 图片查看器 -->
      <div v-else-if="isImageType" class="flex justify-center">
        <img :src="fileUrl" :alt="fileName" class="max-w-full h-auto" />
      </div>

      <!-- Markdown查看器 -->
      <div v-else-if="fileType === 'md'" class="prose max-w-none">
        <p class="text-gray-500">Markdown文件需要下载后查看</p>
        <a 
          :href="fileUrl" 
          download
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          下载Markdown文件
        </a>
      </div>

      <!-- 其他文件类型 -->
      <div v-else class="text-center">
        <p class="text-gray-500">无法预览此文件类型，请下载后查看</p>
        <a 
          :href="fileUrl" 
          download
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          下载文件
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  }
})

// 获取文件类型
const fileType = computed(() => {
  const parts = props.fileName.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
})

// 判断是否为图片类型
const isImageType = computed(() => {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType.value)
})
</script> 
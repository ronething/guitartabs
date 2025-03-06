<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0" :class="iconColorClass">
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
          </svg>
        </div>
        <div class="ml-5">
          <h3 class="text-lg font-medium text-gray-900 truncate">{{ title }}</h3>
          <div class="mt-1 text-sm text-gray-500">
            <slot name="subtitle"></slot>
          </div>
        </div>
      </div>
      <div v-if="$slots.default" class="mt-4">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" class="mt-6">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  colorTheme: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'indigo', 'red', 'green', 'yellow', 'purple'].includes(value)
  }
})

const iconColorClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500 rounded-md p-3',
    indigo: 'bg-indigo-500 rounded-md p-3',
    red: 'bg-red-500 rounded-md p-3',
    green: 'bg-green-500 rounded-md p-3',
    yellow: 'bg-yellow-500 rounded-md p-3',
    purple: 'bg-purple-500 rounded-md p-3'
  }
  return colorMap[props.colorTheme] || colorMap.blue
})
</script> 
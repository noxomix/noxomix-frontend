<template>
  <div class="relative">
    <select
      :class="selectClasses"
      :disabled="disabled"
      :required="required"
      :value="modelValue"
      @change="handleChange"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 9l6 6l6 -6" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  size: 'md',
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const baseClasses = 'block w-full bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer appearance-none'

const sizeClasses = {
  sm: 'pl-3 pr-10 py-1.5 text-sm',
  md: 'pl-3 pr-10 py-2 text-sm',
  lg: 'pl-4 pr-10 py-3 text-base'
}

const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500/20'

const selectClasses = computed(() => {
  return [
    baseClasses,
    sizeClasses[props.size],
    props.error ? errorClasses : ''
  ].filter(Boolean).join(' ')
})
</script>
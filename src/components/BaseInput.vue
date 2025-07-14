<template>
  <input
    :class="inputClasses"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :value="modelValue"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  size: 'md',
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  if (props.type === 'number') {
    value = target.valueAsNumber || 0
  }
  
  emit('update:modelValue', value)
}

const baseClasses = 'block w-full bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
}

const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500/20'

const inputClasses = computed(() => {
  return [
    baseClasses,
    sizeClasses[props.size],
    props.error ? errorClasses : ''
  ].filter(Boolean).join(' ')
})
</script>
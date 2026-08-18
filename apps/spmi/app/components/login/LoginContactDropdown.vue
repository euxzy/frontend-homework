<template>
  <SDropdown
    v-model="selectedValue"
    side="top"
    align="start"
    :scrollable="false"
  >
    <template #trigger>
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-1 transition-shadow hover:shadow-2"
      >
        <i class="si-heroicon-solid-phone text-title-lg text-primary-main" />
      </button>
    </template>

    <div class="w-64 rounded-lg p-4 shadow-2">
      <h3 class="mb-3 text-body-sm font-medium text-secondary">
        {{ title }}
      </h3>
      <div class="flex flex-col gap-6">
        <div
          v-for="item in contacts"
          :key="item.label"
          class="flex items-start gap-3"
        >
          <div class="bg-secondary-subtle px-1 rounded">
            <i
              :class="item.icon"
              class="text-secondary-default"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-body-md text-placeholder">{{ item.label }}</span>
            <span class="text-body-md font-medium text-main">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </SDropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { SDropdown } from '@sutekipub/sicoco-v3-next'

export interface ContactItem {
	icon: string
	label: string
	value: string
}

interface Props {
	title?: string
	contacts?: ContactItem[]
}

withDefaults(defineProps<Props>(), {
	title: '',
	contacts: () => [],
})

const selectedValue = ref(null)
</script>

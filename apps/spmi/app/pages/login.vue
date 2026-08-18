<template>
  <div class="flex min-h-screen flex-col">
    <!-- Header -->
    <header class="flex items-center gap-4 px-12 py-6 tablet:px-12">
      <img
        :alt="t('login.logo_alt')"
        class="h-14 w-14"
        src="/images/logo-suteki.png"
      >
      <div class="flex flex-col items-start gap-1">
        <span class="text-title-sm font-semibold text-main">{{ t('login.university_name') }}</span>
        <span class="text-body-md text-placeholder">{{ t('login.system_name') }}</span>
      </div>
      <label class="ml-auto flex items-center gap-2 text-body-sm text-main">
        <span class="sr-only">{{ t('language.label') }}</span>
        <select
          :value="locale"
          :aria-label="t('language.label')"
          class="rounded-md border border-border-main bg-white px-3 py-2"
          @change="onLocaleChange"
        >
          <option value="id">{{ t('language.indonesian') }}</option>
          <option value="en">{{ t('language.english') }}</option>
        </select>
      </label>
    </header>

    <!-- Main Content -->
    <main class="grid flex-1 grid-cols-2 items-center px-12">
      <!-- Feature Image -->
      <div class="hidden desktop:flex">
        <div class="relative h-180 max-w-180 overflow-hidden rounded-xl">
          <img
            :alt="t('login.campus_alt')"
            class="h-full w-full object-cover"
            src="/images/login/building.png"
          >
          <!-- Contact Dropdown -->
          <div class="absolute bottom-5 left-5">
            <LoginContactDropdown
              :title="t('login.contact_title')"
              :contacts="contactList"
            />
          </div>
        </div>
      </div>

      <!-- Login Card -->
      <div class="w-full max-w-140 justify-self-center rounded-xl p-9 shadow-1">
        <LoginForm />
      </div>
    </main>

    <!-- Footer -->
    <footer class="flex items-center justify-between px-12 py-5">
      <span class="text-body-sm text-main">{{ t('login.copyright') }}</span>
      <SButton
        variant="link-neutral"
        class="text-body-sm"
      >
        {{ t('login.privacy_policy') }}
      </SButton>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { SButton } from '@sutekitechid/sicoco-v3-next'

import LoginContactDropdown from '~/components/login/LoginContactDropdown.vue'
import type { ContactItem } from '~/components/login/LoginContactDropdown.vue'
import LoginForm from '~/components/login/LoginForm.vue'

definePageMeta({
	layout: false,
	auth: {
		unauthenticatedOnly: true,
		navigateAuthenticatedTo: '/about',
	},
})

const { locale, setLocale, t } = useI18n()

function onLocaleChange(event: Event) {
	setLocale((event.target as HTMLSelectElement).value)
}

const contactList = computed<ContactItem[]>(() => [
	{
		icon: 'si-heroicon-solid-envelope',
		label: t('contact.email'),
		value: 'spmi@universitas.ac.id',
	},
	{
		icon: 'si-heroicon-solid-phone',
		label: t('contact.phone'),
		value: '082155550100',
	},
	{
		icon: 'si-heroicon-solid-chat-bubble-left',
		label: t('contact.whatsapp'),
		value: '081299998888',
	},
])
</script>

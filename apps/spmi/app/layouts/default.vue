<template>
  <div class="min-h-screen bg-primary-subtle">
    <header class="bg-white">
      <div class="mx-auto flex h-15 max-w-360 items-center justify-between px-4 tablet:px-8 desktop:px-15">
        <div class="flex min-w-0 items-center gap-3.5">
          <img
            :alt="t('navigation.logo_alt')"
            class="h-12 w-12 shrink-0"
            src="/images/logo-suteki.png"
          >
          <div class="min-w-0">
            <p class="truncate text-body-sm font-semibold text-main">{{ t('navigation.university_name') }}</p>
            <p class="hidden truncate text-body-sm text-placeholder tablet:block">{{ t('navigation.system_name') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4 tablet:gap-7.5">
          <button
            :aria-label="t('navigation.notifications')"
            class="relative text-placeholder"
            data-testid="default-layout-notification-button"
            disabled
            type="button"
          >
            <i class="si-heroicon-outline-bell text-title-lg" aria-hidden="true" />
            <span class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-danger-main text-caption-sm font-semibold text-white">2</span>
          </button>

          <label class="hidden items-center gap-2 text-body-sm font-semibold text-main tablet:flex" for="default-layout-locale">
            <i class="si-heroicon-outline-language text-title-md" aria-hidden="true" />
            <select
              id="default-layout-locale"
              :aria-label="t('language.label')"
              class="appearance-none bg-transparent pr-5 text-body-sm font-semibold text-main"
              data-testid="default-layout-locale-select"
              :value="locale"
              @change="onLocaleChange"
            >
              <option value="id">{{ t('language.indonesian') }}</option>
              <option value="en">{{ t('language.english') }}</option>
            </select>
          </label>

          <button
            :aria-label="t('navigation.profile')"
            class="flex items-center gap-3 text-left"
            data-testid="default-layout-profile-button"
            disabled
            type="button"
          >
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navigation-main text-label-md font-semibold text-white">JR</span>
            <span class="hidden desktop:block">
              <span class="block text-body-sm font-semibold text-main">{{ t('navigation.user_name') }}</span>
              <span class="block text-body-sm text-placeholder">{{ t('navigation.user_role') }}</span>
            </span>
            <i class="hidden si-heroicon-outline-chevron-down text-placeholder desktop:block" aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav
        :aria-label="t('navigation.label')"
        class="h-11 overflow-x-auto bg-navigation-main"
        data-testid="default-layout-navigation"
      >
        <ul class="mx-auto flex h-full min-w-max max-w-360 items-center gap-10 px-4 tablet:px-8 desktop:px-18">
          <li v-for="item in menuItems" :key="item.label">
            <button
              class="flex h-11 items-center gap-2 text-body-sm font-semibold text-white opacity-70"
              disabled
              type="button"
            >
              <i :class="item.icon" aria-hidden="true" />
              {{ t(item.label) }}
              <i v-if="item.expandable" class="si-heroicon-outline-chevron-down text-navigation-muted" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </nav>
    </header>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, setLocale, t } = useI18n()

const menuItems = [
  { icon: 'si-heroicon-outline-briefcase', label: 'navigation.menus.data', expandable: false },
  { icon: 'si-heroicon-outline-globe-alt', label: 'navigation.menus.preparation', expandable: true },
  { icon: 'si-heroicon-outline-academic-cap', label: 'navigation.menus.process', expandable: true },
  { icon: 'si-heroicon-outline-clipboard-document-list', label: 'navigation.menus.repository', expandable: false },
]

function onLocaleChange(event: Event) {
  setLocale((event.target as unknown as { value: 'id' | 'en' }).value)
}
</script>

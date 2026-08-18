<template>
  <SFormInput
    @submit="onSubmit"
  >
    <!-- Title -->
    <div class="flex flex-col gap-2">
      <h1 class="text-heading-lg font-semibold text-main">
        {{ t('login.welcome_title') }}
      </h1>
      <p class="text-body-md text-placeholder">
        {{ t('login.welcome_subtitle') }}
      </p>
    </div>

    <!-- Google Sign-in Button -->
    <div class="w-full">
      <SButton
        type="button"
        variant="neutral"
        outlined
        class="w-full"
        @click="onGoogle"
      >
        <template #icon-left>
          <img
            src="~/assets/google.svg"
            :alt="t('login.google_alt')"
            class="h-5 w-5"
          >
        </template>
        {{ t('login.google_sign_in') }}
      </SButton>
    </div>

    <!-- Divider -->
    <div class="flex items-center gap-3">
      <div class="h-px flex-1 border bg-border-main" />
      <span class="text-body-sm text-placeholder">{{ t('login.or') }}</span>
      <div class="h-px flex-1 border bg-border-main" />
    </div>

    <!-- Username/Email Field -->
    <Field
      :label="t('login.username_label')"
      required
    >
      <SInput
        v-model="username"
        type="text"
        name="username"
        :placeholder="t('login.username_placeholder')"
        autocomplete="username"
        required
      >
        <template #required>
          {{ t('login.username_required') }}
        </template>
      </SInput>
    </Field>

    <!-- Password Field -->
    <SField
      :label="t('login.password_label')"
      required
      class="mb-4!"
    >
      <div class="relative">
        <SInput
          v-model="password"
          name="password"
          :placeholder="t('login.password_placeholder')"
          autocomplete="current-password"
          required
        >
          <template #required>
            {{ t('login.password_required') }}
          </template>
        </SInput>
      </div>
    </SField>

    <!-- Forgot Password -->
    <div class="mb-4! text-right">
      <NuxtLink
        to="/forgot-password"
      >
        <SButton
          type="button"
          variant="link-secondary"
        >
          {{ t('login.forgot_password') }}
        </SButton>
      </NuxtLink>
    </div>

    <!-- Submit Button -->
    <div class="w-full">
      <SButton
        type="submit"
        variant="primary"
        class="w-full"
      >
        {{ t('login.submit') }}
      </SButton>
    </div>
  </SFormInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { SButton, SFormInput, SInput } from '@sutekipub/sicoco-v3-next'

import Field from '~/components/Field.vue'

import { useCentralLogin } from '~/composables/useCentralLogin'

const { t } = useI18n()

const username = ref('')
const password = ref('')

const { signIn } = useCentralLogin()

async function onSubmit() {
	await signIn({
		username: username.value,
		password: password.value,
		redirectTo: '/',
	})
}
</script>

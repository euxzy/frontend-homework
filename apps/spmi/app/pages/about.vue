<template>
  <main class="mx-auto w-full max-w-5xl px-6 py-10 tablet:px-10 tablet:py-16">
    <section class="rounded-xl border border-border-main bg-white p-6 shadow-1 tablet:p-10">
      <p class="text-label-md font-semibold text-primary-main">
        {{ t('about.assignment.eyebrow') }}
      </p>
      <h1 class="mt-2 text-heading-xl font-semibold text-main">
        {{ t('about.assignment.title') }}
      </h1>
      <p class="mt-4 max-w-3xl text-body-md text-placeholder">
        {{ t('about.assignment.description') }}
      </p>
    </section>

    <div class="mt-6 grid gap-6 desktop:grid-cols-[minmax(0,1fr)_19rem]">
      <div class="space-y-6">
        <section class="rounded-xl border border-border-main bg-white p-6 shadow-1">
          <h2 class="text-heading-md font-semibold text-main">
            {{ t('about.assignment.design_title') }}
          </h2>
          <p class="mt-2 text-body-md text-placeholder">
            {{ t('about.assignment.design_description') }}
          </p>
          <p class="mt-3 text-body-sm font-medium text-main">
            {{ t('about.assignment.figma_mcp_hint') }}
          </p>
          <a
            class="mt-4 inline-flex items-center gap-2 text-body-md font-medium text-primary-main hover:underline"
            href="https://www.figma.com/design/S3c6mr4pEJt1b2tHcq3gMl/Interview---FE?node-id=0-1&p=f&m=dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('about.assignment.open_figma') }}
            <i class="si-heroicon-solid-arrow-top-right-on-square" aria-hidden="true" />
          </a>
        </section>

        <section class="rounded-xl border border-border-main bg-white p-6 shadow-1">
          <h2 class="text-heading-md font-semibold text-main">
            {{ t('about.assignment.steps_title') }}
          </h2>
          <ol class="mt-5 space-y-5">
            <li class="flex gap-4">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label-md font-semibold text-primary-main">1</span>
              <p class="pt-0.5 text-body-md text-main">{{ t('about.assignment.steps.repository') }}</p>
            </li>
            <li class="flex gap-4">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label-md font-semibold text-primary-main">2</span>
              <p class="pt-0.5 text-body-md text-main">{{ t('about.assignment.steps.login') }}</p>
            </li>
            <li class="flex gap-4">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label-md font-semibold text-primary-main">3</span>
              <p class="pt-0.5 text-body-md text-main">{{ t('about.assignment.steps.implement') }}</p>
            </li>
            <li class="flex gap-4">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label-md font-semibold text-primary-main">4</span>
              <p class="pt-0.5 text-body-md text-main">{{ t('about.assignment.steps.ai_agent') }}</p>
            </li>
            <li class="flex gap-4">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label-md font-semibold text-primary-main">5</span>
              <p class="pt-0.5 text-body-md text-main">{{ t('about.assignment.steps.docker') }}</p>
            </li>
            <li class="flex gap-4">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label-md font-semibold text-primary-main">6</span>
              <p class="pt-0.5 text-body-md text-main">{{ t('about.assignment.steps.implementations_api') }}</p>
            </li>
          </ol>
        </section>
      </div>

      <aside class="space-y-6">
        <section class="rounded-xl bg-primary-subtle p-6">
          <h2 class="text-heading-sm font-semibold text-main">
            {{ t('about.assignment.credentials_title') }}
          </h2>
          <dl class="mt-4 space-y-4 text-body-md">
            <div>
              <dt class="text-placeholder">{{ t('about.assignment.username') }}</dt>
              <dd><code class="font-medium text-main">admin@spmi.local</code></dd>
            </div>
            <div>
              <dt class="text-placeholder">{{ t('about.assignment.password') }}</dt>
              <dd><code class="font-medium text-main">spmi12345</code></dd>
            </div>
          </dl>
        </section>

        <section class="rounded-xl border border-border-main bg-white p-6 shadow-1">
          <h2 class="text-heading-sm font-semibold text-main">
            {{ t('about.assignment.submission_title') }}
          </h2>
          <ol class="mt-4 list-decimal space-y-2 pl-5 text-body-md text-main marker:font-semibold marker:text-primary-main">
            <li>{{ t('about.assignment.submission.fork') }}</li>
            <li>{{ t('about.assignment.submission.branch') }}</li>
            <li>{{ t('about.assignment.submission.verify') }}</li>
            <li>{{ t('about.assignment.submission.pr') }}</li>
            <li>{{ t('about.assignment.submission.summary') }}</li>
          </ol>
        </section>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

definePageMeta({
	auth: false,
})

const { t } = useI18n()
</script>

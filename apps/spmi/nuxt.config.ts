import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  workspaceDir: '../../',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@sidebase/nuxt-auth'],
  i18n: {
    defaultLocale: 'id',
    fallbackLocale: 'id',
    langDir: 'locales',
    lazy: true,
    locales: [
      { code: 'id', language: 'id-ID', name: 'Bahasa Indonesia', file: 'id.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    strategy: 'no_prefix',
  },
  devServer: {
    host: 'localhost',
    port: 4200,
  },
  routeRules: {
    '/': { redirect: '/about' },
  },
  runtimeConfig: {
    baseURL: '/api/auth',
  },
  auth: {
    originEnvKey: 'NUXT_BASE_URL',
    globalAppMiddleware: true,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        getSession: { path: '/session', method: 'get' },
        signUp: false,
      },
      pages: {
        login: '/login',
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: 'spmi.auth-token',
        maxAgeInSeconds: 60 * 60 * 8,
        sameSiteAttribute: 'lax',
        secureCookieAttribute: process.env.NODE_ENV === 'production',
      },
      session: {
        dataType: {
          id: 'string',
          name: 'string',
          email: 'string',
          role: 'string',
        },
      },
    },
  },
  typescript: {
    typeCheck: false,
    tsConfig: {
      extends: '../../../tsconfig.base.json', // Nuxt copies this string as-is to the `./.nuxt/tsconfig.json`, therefore it needs to be relative to that directory
    },
  },
  imports: {
    autoImport: true,
  },
  css: [
    '~/assets/css/styles.css',
		'@sutekitechid/sicoco-v3-next/dist/assets/sicoco-v3-next.css',
    '@sutekitechid/sicoco-v3-next/dist/assets/icomoon/style.css',
  ],
  vite: {
    plugins: [tailwindcss(), nxViteTsPaths()],
  },
});

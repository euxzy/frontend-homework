<template>
  <main class="mx-auto w-full max-w-360 px-4 py-6 tablet:px-8 tablet:py-8 desktop:px-15">
    <section class="border rounded-xl border-border-main bg-white p-5 tablet:p-6">
      <h1 class="text-body-lg text-main">
        <span class="font-semibold">{{ t('implementations.title') }}</span>
        <span class="text-placeholder font-normal"> | {{ t('implementations.description') }}</span>
      </h1>

      <div class="mt-6 flex flex-col gap-4 tablet:flex-row tablet:justify-end">
        <label class="flex w-full flex-col gap-2 text-label-md font-medium text-main tablet:w-80">
          {{ t('implementations.filters.unit') }}
          <SDropdown
            v-model="params.unit_id"
            :loading="isFiltersLoading"
            :placeholder="t('implementations.filters.all_units')"
            data-testid="implementations-unit-filter"
          >
            <SDropdownItem value="">{{ t('implementations.filters.all_units') }}</SDropdownItem>
            <SDropdownItem v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </SDropdownItem>
          </SDropdown>
        </label>

        <label class="flex w-full flex-col gap-2 text-label-md font-medium text-main tablet:w-80">
          {{ t('implementations.filters.period') }}
          <SDropdown
            v-model="params.period_id"
            :loading="isFiltersLoading"
            :placeholder="t('implementations.filters.all_periods')"
            data-testid="implementations-period-filter"
          >
            <SDropdownItem value="">{{ t('implementations.filters.all_periods') }}</SDropdownItem>
            <SDropdownItem v-for="period in periods" :key="period.id" :value="period.id">
              {{ period.label }}
            </SDropdownItem>
          </SDropdown>
        </label>
      </div>

      <SAlert v-if="filterError || errorMessage" class="mt-6" variant="danger">
        <SAlertTitle>{{ t('implementations.states.error_title') }}</SAlertTitle>
        <SAlertDescription>{{ filterError || errorMessage }}</SAlertDescription>
      </SAlert>

      <SDataTable
        class="mt-6"
        :data="implementations"
        data-testid="implementations-table"
        :loading="isLoading"
        :paginated="true"
        :show-numbering="true"
      >
        <SDataTableColumn field="unit" width="220">
          <template #header>{{ t('implementations.table.unit') }}</template>
          <template #default="{ row }">{{ row.unit.name }}</template>
        </SDataTableColumn>
        <SDataTableColumn field="audit_name" width="220">
          <template #header>{{ t('implementations.table.audit_name') }}</template>
          <template #default="{ row }">{{ row.audit_name }}</template>
        </SDataTableColumn>
        <SDataTableColumn field="instrument" width="250">
          <template #header>{{ t('implementations.table.instrument') }}</template>
          <template #default="{ row }">{{ row.instrument }}</template>
        </SDataTableColumn>
        <SDataTableColumn field="filling_date" width="210">
          <template #header>{{ t('implementations.table.filling_date') }}</template>
          <template #default="{ row }">{{ formatDateRange(row.filling_date) }}</template>
        </SDataTableColumn>
        <SDataTableColumn field="filling_progress" width="220">
          <template #header>{{ t('implementations.table.filling_progress') }}</template>
          <template #default="{ row }">
            <SProgress
              :aria-label="t('implementations.progress_aria', { progress: row.filling_progress })"
              :model-value="row.filling_progress"
              :variant="progressVariant(row.filling_progress)"
            />
          </template>
        </SDataTableColumn>
        <SDataTableColumn field="action" width="84">
          <template #header>{{ t('implementations.table.action') }}</template>
          <template #default="{ row }">
            <SButton
              :aria-label="t('implementations.action_aria', { audit: row.audit_name })"
              outlined
              size="sm"
              type="button"
              class="text-navigation-main border-navigation-main"
            >
              {{ t('implementations.view') }}
            </SButton>
          </template>
        </SDataTableColumn>

        <template #empty>
          <STableEmpty>{{ t('implementations.states.empty') }}</STableEmpty>
        </template>
      </SDataTable>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  SAlert,
  SAlertDescription,
  SAlertTitle,
  SButton,
  SDataTable,
  SDataTableColumn,
  SDropdown,
  SDropdownItem,
  SProgress,
  STableEmpty,
} from '@sutekipub/sicoco-v3-next'
import { useI18n } from 'vue-i18n'

interface Unit {
  id: string
  name: string
}

interface Period {
  id: string
  label: string
}

interface Implementation {
  id: string
  period_id: string
  unit: Unit
  audit_name: string
  instrument: string
  filling_date: {
    start: string
    end: string
  }
  filling_progress: number
}

const { locale, t } = useI18n()
const params = useQuerySync('period_id', 'unit_id')
const implementations = ref<Implementation[]>([])
const periods = ref<Period[]>([])
const units = ref<Unit[]>([])
const isLoading = ref(true)
const isFiltersLoading = ref(true)
const errorMessage = ref('')
const filterError = ref('')

function formatDateRange(date: Implementation['filling_date']) {
  const formatter = new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return `${formatter.format(new Date(date.start))} - ${formatter.format(new Date(date.end))}`
}

function progressVariant(progress: number) {
  if (progress === 100) return 'success'
  if (progress === 0) return 'danger'
  return 'primary'
}

async function loadFilters() {
  try {
    const [periodResponse, unitResponse] = await Promise.all([
      $fetch<{ periods: Period[] }>('/api/periods'),
      $fetch<{ units: Unit[] }>('/api/units'),
    ])
    periods.value = periodResponse.periods
    units.value = unitResponse.units
  } catch {
    filterError.value = t('implementations.states.filters_error')
  } finally {
    isFiltersLoading.value = false
  }
}

async function loadImplementations() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<{ implementations: Implementation[] }>('/api/implementations', {
      query: {
        period_id: params.period_id || undefined,
        unit_id: params.unit_id || undefined,
      },
    })
    implementations.value = response.implementations
  } catch {
    errorMessage.value = t('implementations.states.load_error')
  } finally {
    isLoading.value = false
  }
}

watch(() => [params.period_id, params.unit_id], loadImplementations, { immediate: true })
onMounted(loadFilters)
</script>

<style scoped>
:deep(thead th) {
  background-color: var(--color-navigation-main);
  color: white;
}
</style>

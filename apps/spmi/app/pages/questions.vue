<template>
  <main class="questions-page">
    <header class="questions-page__header">
      <p class="questions-page__eyebrow">Evaluasi Mutu</p>
      <h1>Daftar Pertanyaan</h1>
      <p v-if="isLoading">Memuat seluruh pertanyaan...</p>
      <p v-else-if="errorMessage" role="alert">{{ errorMessage }}</p>
      <p v-else>{{ filteredQuestions.length.toLocaleString('id-ID') }} pertanyaan ditampilkan sekaligus.</p>
      <label class="questions-page__period">
        Periode
        <select v-model="selectedPeriodId" :disabled="isPeriodsLoading || !periods.length">
          <option v-if="isPeriodsLoading" value="">Memuat periode...</option>
          <option v-for="period in periods" :key="period.id" :value="period.id">
            {{ period.label }}
          </option>
        </select>
      </label>
      <p v-if="periodError" role="alert">{{ periodError }}</p>
    </header>

    <section v-if="filteredQuestions.length" aria-label="Daftar pertanyaan">
      <article
        v-for="question in filteredQuestions"
        :key="question.id"
        class="question-card"
      >
        <span class="question-card__category">{{ question.category }}</span>
        <span class="question-card__period">{{ periodLabels[question.period_id] }}</span>
        <h2>{{ question.id }}. {{ question.question }}</h2>
        <div class="question-card__options">
          <label v-for="option in question.options" :key="option">
            <input :name="`question-${question.id}`" type="radio">
            {{ option }}
          </label>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
interface Question {
  id: number;
  period_id: string;
  category: string;
  question: string;
  options: string[];
}

interface Period {
  id: string;
  label: string;
}

interface PeriodsResponse {
  periods: Period[];
}

interface QuestionsResponse {
  questions: Question[];
}

const questions = ref<Question[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const periods = ref<Period[]>([]);
const selectedPeriodId = ref('');
const isPeriodsLoading = ref(true);
const periodError = ref('');
const periodLabels = computed(() => Object.fromEntries(periods.value.map((period) => [period.id, period.label])));
const filteredQuestions = computed(() => questions.value);

async function loadQuestions() {
  try {
    const response = await $fetch<QuestionsResponse>('/api/questions');
    questions.value = response.questions;
    selectedPeriodId.value = response.questions[0]?.period_id ?? '';
  } catch {
    errorMessage.value = 'Pertanyaan tidak dapat dimuat.';
  } finally {
    isLoading.value = false;
  }
}

async function loadPeriods() {
  try {
    const response = await $fetch<PeriodsResponse>('/api/periods');
    periods.value = response.periods;
    selectedPeriodId.value = response.periods[0]?.id ?? '';
  } catch {
    periodError.value = 'Periode tidak dapat dimuat.';
  } finally {
    isPeriodsLoading.value = false;
  }
}

onMounted(() => {
  loadQuestions();
  loadPeriods();
});
</script>

<style scoped>
.questions-page {
  margin: 0 auto;
  max-width: 960px;
  padding: 2rem 1rem;
}

.questions-page__header {
  margin-bottom: 2rem;
}

.questions-page__header h1 {
  margin: 0;
}

.questions-page__eyebrow {
  color: #5c6877;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
}

.questions-page__period {
  display: grid;
  font-weight: 600;
  gap: 0.5rem;
  max-width: 22rem;
}

.questions-page__period select {
  background: white;
  border: 1px solid #d9dfe7;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

.question-card {
  border: 1px solid #d9dfe7;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
}

.question-card h2 {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0.5rem 0 1rem;
}

.question-card__category {
  color: #52677e;
  font-size: 0.875rem;
}

.question-card__period {
  color: #5c6877;
  display: block;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.question-card__options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
}

.question-card__options label {
  display: flex;
  gap: 0.5rem;
}
</style>

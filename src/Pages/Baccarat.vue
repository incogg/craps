<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BaccaratResult from '@/Baccarat/Result.vue'
import PayoutArea from '@/Common/PayoutArea.vue'
import DiffDock from '@/Common/DiffDock.vue'
import OptionalsScenario from '@/Baccarat/OptionalsScenario'
import { useDifficulty } from '@/Common/useDifficulty'

const SCENARIOS = [OptionalsScenario]

const route = useRoute()
const { difficulty } = useDifficulty()

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const availableScenarios = computed(() => {
    const id = route.query.scenario
    if (id) {
        const match = SCENARIOS.find(s => s.id === id)
        if (match) return [match]
    }
    return SCENARIOS
})

const currentScenario = ref(null)
const round            = ref(null)

const status       = ref('idle')
const feedbackHtml = ref('')

function reset() {
    currentScenario.value = pick(availableScenarios.value)
    round.value = currentScenario.value.generate(difficulty.value)
}

watch(() => route.query.scenario, () => { status.value = 'idle'; reset() })
watch(difficulty,                 () => { status.value = 'idle'; reset() })

function onSubmit(value) {
    const correct    = currentScenario.value.computePayout(round.value)
    const wasCorrect = Math.abs(value - correct) < 0.01
    status.value     = wasCorrect ? 'correct' : 'wrong'
    feedbackHtml.value = wasCorrect
        ? currentScenario.value.correctDetail(round.value, correct)
        : currentScenario.value.wrongDetail
            ? currentScenario.value.wrongDetail(round.value, correct)
            : `The correct payout was <span class='hi'>$${correct}</span>`
}

function onNext() {
    status.value = 'idle'
    reset()
}

reset()
</script>

<template>
    <div class="page">
        <nav class="top-nav">
            <RouterLink to="/" class="nav-back">← Home</RouterLink>
            <DiffDock />
            <span class="nav-game">{{ currentScenario?.label ?? 'Baccarat' }}</span>
        </nav>

        <BaccaratResult
            :banker-cards="round.bankerCards"
            :player-cards="round.playerCards"
            :b-final="round.bTotal"
            :p-final="round.pTotal"
            :result="round.result"
        />

        <component
            :is="currentScenario?.layout"
            v-bind="currentScenario?.layoutProps(round)"
        />

        <PayoutArea
            :status="status"
            :correct="0"
            :feedback-html="feedbackHtml"
            @submit="onSubmit"
            @next="onNext"
        />
    </div>
</template>

<style scoped>
.page {
    width: 100%;
    max-width: 560px;
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.top-nav {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
}
:deep(.diff-dock) { justify-self: center; }
.nav-back {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--text-muted);
    text-decoration: none;
    text-transform: uppercase;
}
.nav-back:hover { color: var(--text); }
.nav-game {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: var(--text-muted);
    text-transform: uppercase;
    white-space: nowrap;
}
</style>

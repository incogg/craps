<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  status: { type: String, default: 'idle' }, // 'idle' | 'correct' | 'wrong'
  correct: { type: Number, default: 0 },
  feedbackHtml: { type: String, default: '' }
})

const emit = defineEmits(['submit', 'next'])

const inputVal = ref('')

watch(() => props.status, (val) => {
  if (val === 'idle') inputVal.value = ''
})

function onSubmit() {
  const v = parseFloat(inputVal.value) || 0
  emit('submit', v)
}

function onKeydown(e) {
  if (e.key !== 'Enter') return
  if (props.status === 'idle') onSubmit()
  else emit('next')
}
</script>

<template>
  <div class="card">
    <div class="answer-body">
      <span class="overline">Your Answer</span>
      <div class="input-row" :class="{ 'state-correct': status === 'correct', 'state-wrong': status === 'wrong' }">
        <span class="input-prefix">$</span>
        <input
          type="tel"
          class="answer-input"
          v-model="inputVal"
          placeholder="0"
          inputmode="decimal"
          :readonly="status !== 'idle'"
          @keydown="onKeydown"
          ref="inputEl"
        />
      </div>
      <button v-if="status === 'idle'" class="btn" @click="onSubmit">SUBMIT →</button>
    </div>
  </div>

  <div v-if="status !== 'idle'" class="card">
    <div class="feedback-body">
      <div class="feedback-msg" :class="status === 'correct' ? 'correct' : 'wrong'">
        {{ status === 'correct' ? 'Correct.' : 'Not quite.' }}
      </div>
      <div class="feedback-detail" v-html="feedbackHtml"></div>
    </div>
    <div class="feedback-next">
      <button class="btn next-btn" @click="emit('next')">NEXT ROUND →</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--card-bg);
  border: 1px solid var(--border-page);
  border-radius: 14px;
  overflow: hidden;
}
.overline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.answer-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input-row {
  background: #1a1a1a;
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: border-color 200ms, background 200ms;
}
.input-prefix {
  font-size: 26px;
  font-weight: 900;
  color: var(--text-muted);
}
.answer-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--text);
  width: 100%;
  caret-color: var(--correct);
}
.input-row.state-correct { border-color: var(--correct); background: rgba(52,211,153,0.06); }
.input-row.state-wrong   { border-color: var(--wrong);   background: rgba(239,68,68,0.06); }
.btn {
  width: 100%;
  padding: 15px;
  background: #f2f2f2;
  color: #0a0a0a;
  border: none;
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 150ms ease;
}
.btn:hover { background: white; transform: translateY(-1px); }
.btn.next-btn { background: var(--correct); color: #062a1a; }
.btn.next-btn:hover { background: #4ade80; }
.feedback-body { padding: 16px 20px 4px; }
.feedback-msg {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}
.feedback-msg.correct { color: var(--correct); }
.feedback-msg.wrong   { color: var(--wrong); }
.feedback-detail {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.7;
}
:deep(.hi) { color: var(--correct); }
.feedback-next { padding: 0 20px 20px; margin-top: 14px; }
</style>

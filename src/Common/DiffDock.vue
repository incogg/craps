<script setup>
import { useDifficulty } from './useDifficulty'

const { difficulty, setDifficulty } = useDifficulty()

const tiers = [
  { diff: 'easy',   tier: 1, label: 'Training' },
  { diff: 'medium', tier: 2, label: 'Main Floor' },
  { diff: 'hard',   tier: 3, label: 'Sovereign' },
]
</script>

<template>
  <div class="diff-dock" role="radiogroup" aria-label="Difficulty">
    <span class="diff-prefix">DIFFICULTY</span>
    <button
      v-for="t in tiers"
      :key="t.diff"
      class="diff-btn"
      :class="{ active: difficulty === t.diff }"
      :data-tier="t.tier"
      role="radio"
      :aria-checked="difficulty === t.diff"
      @click="setDifficulty(t.diff)"
    >
      <span class="pip"></span>{{ t.label }}
    </button>
  </div>
</template>

<style scoped>
.diff-dock {
  background: rgba(8,8,8,0.92);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 999px;
  padding: 4px;
  display: flex;
  align-items: center;
}
.diff-prefix {
  padding: 0 11px 0 13px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  border-right: 1px solid rgba(255,255,255,0.06);
  margin-right: 4px;
  height: 26px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.diff-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 7px 11px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
}
.diff-btn:hover { color: var(--text); }
.pip {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  transition: background 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}
.diff-btn[data-tier="1"] .pip { background: rgba(52,211,153,0.35); }
.diff-btn[data-tier="2"] .pip { background: rgba(233,195,73,0.35); }
.diff-btn[data-tier="3"] .pip { background: rgba(212,75,106,0.35); }
.diff-btn.active {
  color: var(--text);
  background: rgba(255,255,255,0.04);
}
.diff-btn[data-tier="1"].active .pip { background: #34d399; box-shadow: 0 0 10px #34d399; }
.diff-btn[data-tier="2"].active .pip { background: #e9c349; box-shadow: 0 0 10px #e9c349; }
.diff-btn[data-tier="3"].active .pip { background: #d44b6a; box-shadow: 0 0 10px #d44b6a; }

@media (max-width: 480px) {
  .diff-prefix { display: none; }
  .diff-btn { padding: 7px 8px; font-size: 9px; }
}
</style>

<template>
    <section class="payout-container" :class="`state-${status}`">
        <div class="payout-card">
            <div class="payout-header">
                <span class="payout-label">Total Payout</span>
                <div v-if="status !== 'normal'" class="payout-status">
                    <span class="payout-status__icon material-symbols-outlined">{{ statusIcon }}</span>
                    <span>{{ status }}</span>
                </div>
            </div>

            <div class="payout-box" :class="`payout-box--${status}`">
                <template v-if="status === 'normal'">
                    <span class="payout-value">$</span>
                    <input
                        type="text"
                        inputmode="numeric"
                        class="payout-input payout-value"
                        placeholder="0"
                        v-model="displayValue"
                        @input="displayValue = $event.target.value.replace(/\D/g, '')"
                        ref="inputRef"
                    />
                </template>

                <template v-else-if="status === 'correct'">
                    <span class="payout-value payout-value--correct">${{ displayValue || '0' }}</span>
                </template>

                <template v-else>
                    <div class="payout-col">
                        <span class="payout-value payout-value--wrong">${{ displayValue || '0' }}</span>
                        <span class="payout-col__label">Your Entry</span>
                    </div>
                    <div class="payout-col payout-col--right">
                        <span class="payout-col__label">Correct Total</span>
                        <span class="payout-value">${{ correctTotal }}</span>
                    </div>
                </template>
            </div>

            <button class="payout-btn" :class="`payout-btn--${status}`" @click="handleAction">
                <span>{{ actionLabel }}</span>
                <span class="material-symbols-outlined payout-btn__icon">{{ actionIcon }}</span>
            </button>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
const onKeydown = (e) => { if (e.key === "Enter") handleAction(); };

const props = defineProps({
    status: { type: String, default: 'normal' },
    correctTotal: { type: [Number, String], default: 0 }
});

const inputRef = ref(null);

const focusInput = () => inputRef.value?.focus();

onMounted(focusInput);
watch(() => props.status, (val) => { if (val === 'normal') nextTick(focusInput); });

const emit = defineEmits(["submit", "reset"]);
const displayValue = ref("");

const isNormal    = computed(() => props.status === 'normal');
const statusIcon  = computed(() => props.status === 'correct' ? 'check_circle' : 'error');
const actionLabel = computed(() => isNormal.value ? 'Submit' : 'Restart');
const actionIcon  = computed(() => isNormal.value ? 'arrow_forward' : 'refresh');

const handleAction = () => {
    if (isNormal.value) emit("submit", displayValue.value || 0);
    else {
        displayValue.value = "";
        emit("reset");
    }
};
</script>

<style scoped>
.payout-card {
    background-color: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: "Manrope", sans-serif;
    transition: border-color 0.3s ease;
}

/* Header */
.payout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
}

.payout-label {
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #e5e2e1;
}

.payout-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.state-correct .payout-status   { color: #34d399; }
.state-incorrect .payout-status { color: #f87171; }
.payout-status__icon            { font-size: 20px; }

/* Payout Box */
.payout-box {
    min-height: 100px;
    width: 100%;
    border-radius: 14px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 20px 24px;
}

.payout-box--normal {
    background: rgba(229, 226, 225, 0.05);
    border: 2px solid rgba(229, 226, 225, 0.3);
}

.payout-box--correct {
    background: rgba(52, 211, 153, 0.05);
    border: 2px solid rgba(52, 211, 153, 0.3);
}

.payout-box--incorrect {
    background: rgba(248, 113, 113, 0.05);
    border: 2px solid rgba(248, 113, 113, 0.2);
    padding: 16px 24px;
    justify-content: space-between;
}

/* Payout Value */
.payout-value {
    font-size: 38px;
    font-weight: 900;
}

.payout-value--correct { color: #34d399; }

.payout-value--wrong {
    color: #f87171;
    opacity: 0.6;
}

/* Input */
.payout-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #e5e2e1;
    font-size: 38px;
    font-weight: 900;
    font-family: inherit;
}

/* Comparison Columns */
.payout-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.payout-col--right { align-items: flex-end; }

.payout-col__label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    color: #71717a;
    letter-spacing: 0.05em;
}

/* Button */
.payout-btn {
    border: none;
    border-radius: 12px;
    padding: 18px;
    font-size: 16px;
    font-weight: 900;
    font-family: inherit;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: transform 0.1s ease;
}

.payout-btn:active { transform: scale(0.98); }

.payout-btn__icon { font-size: 24px; }

.payout-btn--normal    { background-color: #e5e2e1; color: #1a1a1a; }
.payout-btn--correct   { background-color: #10b981; color: #1a1a1a; }
.payout-btn--incorrect { background-color: #f87171; color: #1a1a1a; }
</style>

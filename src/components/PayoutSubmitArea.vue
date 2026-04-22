<template>
    <section class="payout-container">
        <div class="payout-card">
            <div class="input-section">
                <label class="payout-label">Total Payout</label>

                <div class="input-group">
                    <div class="input-wrapper">
                        <span class="currency-symbol">$</span>
                        <input
                            type="text"
                            inputmode="numeric"
                            class="payout-input"
                            v-model.number="displayValue"
                            @input="displayValue = $event.target.value.replace( /\D/g, '', )"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            <button class="submit-btn" @click="submitTotal">
                <span>Submit Total</span>
                <span class="material-symbols-outlined submit-icon">arrow_forward</span>
            </button>
        </div>
    </section>
</template>

<script setup>
import { ref } from "vue";

const displayValue = ref(null);
const emit = defineEmits(["submit"]);

const submitTotal = () => emit("submit", displayValue.value || 0);
</script>

<style scoped>
.payout-container {
    width: 100%;
    flex: 0 0 auto;
    margin-top: auto; /* Pushes it to the very bottom */
}

.payout-card {
    background-color: #201f1f; /* surface-container */
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 20px; /* Increased from 16px */
    font-family: "Manrope", sans-serif;
}

.input-section {
    display: flex;
    flex-direction: column;
    gap: 12px; /* Increased from 8px */
}

.payout-label {
    font-size: 13px; /* Increased from 10px */
    font-weight: 800; /* Bumped weight */
    color: #c1c8c2; /* on-surface-variant */
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding: 0 4px;
}

.input-wrapper {
    position: relative;
    flex-grow: 1;
}

.currency-symbol {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 28px; /* Increased from 24px */
    font-weight: 700;
    color: #95d4b3; /* primary emerald */
    pointer-events: none;
}

.payout-input {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(6, 64, 43, 0.5);
    border-radius: 12px;
    padding: 24px 24px 24px 52px; /* Adjusted padding to accommodate larger text */
    font-size: 38px; /* Increased from 32px */
    font-weight: 900;
    color: #ecfdf5;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    font-family: "Manrope", sans-serif;
}

.payout-input:focus {
    border-color: rgba(149, 212, 179, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
}

/* Submit Button and Icon Formatting */
.submit-btn {
    width: 100%;
    padding: 18px; /* Increased from 16px */
    border-radius: 12px;
    background-color: #059669; /* emerald-600 */
    color: #003824; /* on-primary */
    font-family: "Manrope", sans-serif;
    font-weight: 800;
    font-size: 16px; /* Increased from 14px */
    text-transform: uppercase;
    letter-spacing: 0.15em;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px; /* Fixed spacing between text and icon */
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:hover {
    background-color: #10b981;
}

.submit-btn:active {
    transform: scale(0.98);
}

.submit-icon {
    font-size: 24px; /* Increased from 20px */
    line-height: 1; /* Ensures icon box doesn't push button height */
    /* This ensures the arrow looks sharp and weighted correctly */
    font-variation-settings:
        "FILL" 0,
        "wght" 700,
        "GRAD" 0,
        "opsz" 24;
}

.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-spinner {
    -moz-appearance: textfield; /* Firefox */
}
</style>

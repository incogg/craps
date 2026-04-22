<template>
    <div class="view-container">
        <DiceRoll :die1="currentRoll.d1" :die2="currentRoll.d2" />

        <HornBetLayout :bets="currentBets" />

        <PayoutSubmitArea @submit="onPayoutSubmit" />
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { currentBets, randomiseBets, calculatePayout } from "./Bets.js";
import DiceRoll from "./components/DiceRoll.vue";
import HornBetLayout from "./components/HornBetLayout.vue";
import PayoutSubmitArea from "./components/PayoutSubmitArea.vue";

const currentRoll = ref({ d1: 2, d2: 1 });
const rollValue = computed(() => currentRoll.value.d1 + currentRoll.value.d2);
randomiseBets();

const onPayoutSubmit = (value) => {
    console.log("Submission received:", value);
    console.log("Correct payout:", calculatePayout(rollValue.value))
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,700,0,0");

*, *::before, *::after {
    box-sizing: border-box;
}

body {
    background-color: #131313;
    background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 24px 24px;

    color: #e5e2e1;
    font-family: "Manrope", sans-serif;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100dvh;
    overflow: hidden;
}

.view-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    width: 100%;
    max-width: 600px;

    height: 100dvh;
    max-height: 1100px;

    box-sizing: border-box;
}

.view-container > *:nth-child(2) {
    flex: 1;
    min-height: 0;
}
</style>

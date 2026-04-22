<template>
    <section class="dice-roll-container">
        <div class="roll-label">DICE ROLL</div>
        <div class="roll-display">
            <div class="dice-group">
                <div class="dice-wrapper die-left">
                    <Dice :value="die1" />
                </div>
                <div class="dice-wrapper die-right">
                    <Dice :value="die2" />
                </div>
            </div>

            <div class="roll-meta">
                <div class="total-display">{{ die1 + die2 }}</div>
                <div class="roll-name">{{ getRollName(die1, die2) }}</div>
            </div>
        </div>
    </section>
</template>

<script setup>
import Dice from "./Dice.vue";

const props = defineProps({
    die1: { type: Number, required: true },
    die2: { type: Number, required: true },
});

const getRollName = (d1, d2) => {
    const sum = d1 + d2;
    const names = { 2: "High Side", 3: "Low Side", 11: "Low Side", 12: "High Side" };
    return names[sum] || "No Horn";
};
</script>

<style scoped>
.dice-roll-container {
    width: 100%;
    box-sizing: border-box;
    flex: 0 0 auto;
}

.roll-label {
    font-size: 13px; /* Increased from 10px */
    font-weight: 800; /* Bumped weight for legibility */
    color: #c1c8c2;
    letter-spacing: 0.2em;
    margin-bottom: 12px; /* Increased from 8px */
}

.roll-display {
    background-color: rgba(32, 31, 31, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px; /* Increased from 20px */
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dice-wrapper {
    width: 48px;  /* Set a defined size for the top display dice */
    height: 48px;
}

.dice-group {
    display: flex;
    gap: 16px;
    align-items: center; /* Ensures they stay centered horizontally */
}

.total-display {
    font-size: 42px; /* Increased from 36px */
    font-weight: 900;
    color: #95d4b3;
    line-height: 1;
}

.roll-name {
    font-size: 13px; /* Increased from 10px */
    font-weight: 800;
    color: #c1c8c2;
    text-transform: uppercase;
    margin-top: 4px; /* Added slight separation from total */
}

.roll-meta {
    display: flex;
    flex-direction: column;
    align-items: end;
}
</style>

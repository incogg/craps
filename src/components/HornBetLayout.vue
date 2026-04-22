<template>
    <div class="betting-container">
        <div class="section-row border-bottom">
            <div class="bet-info">
                <span class="label-red">ANY SEVEN</span>
                <div
                    class="chip chip-emerald"
                    :class="{ 'is-disabled': bets.anySeven <= 0 }"
                >
                    ${{ bets.anySeven }}
                </div>
            </div>
            <span class="payout-text">4 TO 1</span>
        </div>

        <div class="horn-high-banner">
            <h3>HORN HIGH</h3>
        </div>

        <div class="horn-high-grid border-bottom">
            <div
                v-for="key in ['highTwo', 'highTwelve', 'highThree', 'highEleven']"
                :key="key"
                class="high-cell"
            >
                <span class="cell-label">Hi {{ highNames[key] }}</span>
                <div
                    class="chip chip-gold"
                    :class="{ 'is-disabled': bets[key] <= 0 }"
                >
                    ${{ bets[key] }}
                </div>
            </div>
        </div>

        <div class="main-grid-wrapper">
            <div class="main-betting-grid">
                <div class="bet-cell border-right border-bottom">
                    <div class="dice-pair">
                        <Dice :value="1" />
                        <Dice :value="1" />
                    </div>
                    <div
                        class="chip chip-large"
                        :class="{ 'is-disabled': bets.two <= 0 }"
                    >
                        ${{ bets.two }}
                    </div>
                    <span class="cell-payout">33 TO 1</span>
                </div>

                <div class="bet-cell border-bottom">
                    <div class="dice-pair">
                        <Dice :value="6" />
                        <Dice :value="6" />
                    </div>
                    <div
                        class="chip chip-large"
                        :class="{ 'is-disabled': bets.twelve <= 0 }"
                    >
                        ${{ bets.twelve }}
                    </div>
                    <span class="cell-payout">33 TO 1</span>
                </div>

                <div class="bet-cell border-right">
                    <span class="cell-payout">16 TO 1</span>
                    <div
                        class="chip chip-large"
                        :class="{ 'is-disabled': bets.three <= 0 }"
                    >
                        ${{ bets.three }}
                    </div>
                    <div class="dice-pair">
                        <Dice :value="1" />
                        <Dice :value="2" />
                    </div>
                </div>

                <div class="bet-cell">
                    <span class="cell-payout">16 TO 1</span>
                    <div
                        class="chip chip-large"
                        :class="{ 'is-disabled': bets.eleven <= 0 }"
                    >
                        ${{ bets.eleven }}
                    </div>
                    <div class="dice-pair">
                        <Dice :value="5" />
                        <Dice :value="6" />
                    </div>
                </div>
            </div>

            <div class="hub-container">
                <div class="hub-label">
                    <span>HORN</span>
                    <span>BET</span>
                </div>
                <div
                    class="chip chip-hub"
                    :class="{ 'is-disabled': bets.horn <= 0 }"
                >
                    ${{ bets.horn }}
                </div>
            </div>
        </div>

        <div class="section-row border-top">
            <div class="bet-info">
                <span class="label-red">ANY CRAPS</span>
                <div
                    class="chip chip-emerald"
                    :class="{ 'is-disabled': bets.anyCraps <= 0 }"
                >
                    ${{ bets.anyCraps }}
                </div>
            </div>
            <span class="payout-text">7 ½ TO 1</span>
        </div>
    </div>
</template>

<script setup>
import Dice from "./Dice.vue";

const highNames = {
    highTwo: 2,
    highTwelve: 12,
    highThree: 3,
    highEleven: 11,
}

const props = defineProps({
    bets: {
        type: Object,
        default: () => ({
            anySeven: 0,
            two: 0,
            twelve: 0,
            three: 0,
            eleven: 0,
            horn: 0,
            anyCraps: 0,
            highTwo: 0,
            highTwelve: 0,
            highThree: 0,
            highEleven: 0,
        }),
    },
});
</script>

<style scoped>
.betting-container {
    --table-bg: #062a1a;
    --emerald: #95d4b3;
    --gold: #e9c349;
    --border: rgba(149, 212, 179, 0.2);
    background-color: var(--table-bg);
    border: 2px solid #06402b;
    border-radius: 12px;

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: auto;

    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
    color: white;
    font-family: "Manrope", sans-serif;
}

/* Disabled/Inactive State */
.chip.is-disabled {
    background: rgba(255, 255, 255, 0.05) !important;
    color: rgba(149, 212, 179, 0.2) !important;
    box-shadow: none !important;
    border: 1px solid rgba(149, 212, 179, 0.1);
    filter: grayscale(1);
}

/* Borders & Structure */
.border-bottom {
    border-bottom: 1px solid var(--border);
}
.border-top {
    border-top: 1px solid var(--border);
}
.border-right {
    border-right: 1px solid var(--border);
}

.section-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* MODIFIED: Tighter padding for mobile verticality */
    padding: 12px 20px;
    background-color: rgba(6, 95, 70, 0.1);
}

.bet-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.label-red {
    color: #ef4444;
    font-weight: 900;
    /* MODIFIED: Fluid text scaling - Increased size */
    font-size: clamp(18px, 4.5vw, 24px);
    letter-spacing: -0.05em;
    text-transform: uppercase;
}

.payout-text {
    font-weight: 700;
    font-size: 16px; /* Increased from 14px */
    color: rgba(255, 255, 255, 0.8);
}

.horn-high-banner {
    background-color: rgba(6, 78, 59, 0.4);
    padding: 12px 8px; /* Increased top/bottom padding */
    text-align: center;
    border-bottom: 1px solid var(--border);
}

.horn-high-banner h3 {
    color: var(--emerald);
    font-size: 13px; /* Increased from 10px */
    letter-spacing: 0.3em;
    font-weight: 800;
    margin: 0;
}

.horn-high-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.high-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 10px; /* Increased from 10px to make the area taller */
    gap: 8px;
    border-right: 1px solid var(--border);
}
.high-cell:last-child {
    border-right: none;
}

.cell-label {
    font-size: 11px; /* Increased from 8px */
    font-weight: 700;
    color: rgba(149, 212, 179, 0.6);
    text-transform: uppercase;
}

.main-grid-wrapper {
    position: relative;
    /* MODIFIED: This forces the grid area to expand */
    flex: 1;
    display: flex;
}

.main-betting-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    /* MODIFIED: Stretch grid across wrapper */
    flex: 1;
}

.bet-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* MODIFIED: Distributes dice/chip/payout evenly as height grows */
    justify-content: space-evenly;
    padding: 10px;
    height: 100%;
    box-sizing: border-box;
}

.cell-payout {
    font-size: 13px; /* Increased from 10px */
    font-weight: 800;
    color: rgba(149, 212, 179, 0.5);
}

/* Chip Aesthetics - Font sizes and padding increased for legibility */
.chip {
    border-radius: 20px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    padding: 4px 12px;
    font-size: 12px;
}
.chip-emerald { background: #34d399; color: #062a1a; }
.chip-gold { background: var(--gold); color: black; }

.chip-large {
    background: #34d399;
    color: #062a1a;
    padding: 6px 18px;
    font-size: 16px;
    box-shadow: 0 0 15px rgba(52, 211, 153, 0.3);
}

.chip-hub {
    background: #34d399;
    color: #062a1a;
    padding: 4px 10px;
    font-size: 11px;
}

.hub-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--table-bg);
    border: 1px solid var(--emerald);
    padding: 8px 12px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.hub-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 11px; /* Increased from 8px */
    font-weight: 900;
    line-height: 1.1;
    color: var(--emerald);
}

.dice-pair {
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    height: 28px;
}

.dice-pair > * {
    width: 28px;
}
</style>

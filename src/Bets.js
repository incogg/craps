import { ref } from 'vue';

function jaction(stage) {
    if (stage == 0) return {
        anySeven: 10,
        eleven: 5,
        anyCraps: 10,
    }

    return {
        horn: 20 * stage,
        anySeven: 10 + 5 * stage,
    }
}

function hornHighLow(stage) {
    return {
        horn: 20 * (stage + 1),
        two: 5 * (stage + 1),
        twelve: 5 * (stage + 1),
    }
}

function hornLowies(stage) {
    return {
        horn: 20 * (stage + 1),
        three: 5 * (stage + 1),
        eleven: 5 * (stage + 1),
    }
}

function horn(stage)           { return { horn      : 20 * (stage + 1) } }
function hornHighTwo(stage)    { return { highTwo   : 25 * (stage + 1) } }
function hornHighThree(stage)  { return { highThree : 25 * (stage + 1) } }
function hornHighTwelve(stage) { return { highTwelve: 25 * (stage + 1) } }
function hornHighEleven(stage) { return { highEleven: 25 * (stage + 1) } }

const betVariations = [
    jaction,
    hornHighLow,
    hornLowies,
    horn,
    hornHighTwo,
    hornHighThree,
    hornHighTwelve,
    hornHighEleven,
]

export const currentBets = ref({
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
});

function resetCurrentBets() {
    currentBets.value = {
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
    }
}

export function calculatePayout (result) {
    let sum = 0;
    for (const [key, val] of Object.entries(currentBets.value))
        sum += payouts[key](val, result);
    return sum;
}

export function randomiseBets() {
    const randomIdx = Math.floor(Math.random() * betVariations.length);
    const selectedFunction = betVariations[randomIdx];
    const randomStage = Math.floor(Math.random() * 11);

    resetCurrentBets();
    const bets = selectedFunction(randomStage);
    for (const [key, val] of Object.entries(bets)) { currentBets.value[key] = val; }
}

const payouts = {
    "anySeven": (wager, result) => {
        if (result === 7) return 4 * wager;
        return -wager;
    },

    "anyCraps": (wager, result) => {
        if (result === 2 || result === 3 || result === 12) return 7.5 * wager;
        return -wager;
    },

    "highEleven": (wager, result) => {
        if (result === 2 || result === 12 || result === 11) return (145 * wager) / 25;
        if (result === 3) return (60 * wager) / 25;
        return -wager;
    },

    "highThree": (wager, result) => {
        if (result === 2 || result === 12 || result === 3) return (145 * wager) / 25;
        if (result === 11) return (60 * wager) / 25;
        return -wager;
    },

    "highTwelve": (wager, result) => {
        if (result === 12) return (315 * wager) / 25;
        if (result === 2) return (145 * wager) / 25;
        if (result === 11 || result === 3) return (60 * wager) / 25;
        return -wager;
    },

    "highTwo": (wager, result) => {
        if (result === 2) return (315 * wager) / 25;
        if (result === 12) return (145 * wager) / 25;
        if (result === 11 || result === 3) return (60 * wager) / 25;
        return -wager;
    },

    "twelve": (wager, result) => {
        if (result === 12) return 33 * wager;
        return -wager;
    },

    "two": (wager, result) => {
        if (result === 2) return 33 * wager;
        return -wager;
    },

    "eleven": (wager, result) => {
        if (result === 11) return 16 * wager;
        return -wager;
    },

    "three": (wager, result) => {
        if (result === 3) return 16 * wager;
        return -wager;
    },

    "horn": (wager, result) => {
        if (result === 2 || result === 12) return (150 * wager) / 20;
        if (result === 3 || result === 11) return (65 * wager) / 20;
        return -wager;
    }
};

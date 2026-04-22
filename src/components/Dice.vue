<template>
    <div class="dice">
        <div v-if="[1, 3, 5].includes(value)" class="dot r2 c2"></div>

        <div v-if="value >= 2" class="dot r1 c1"></div>
        <div v-if="value >= 2" class="dot r3 c3"></div>

        <div v-if="value >= 4" class="dot r1 c3"></div>
        <div v-if="value >= 4" class="dot r3 c1"></div>

        <div v-if="value === 6" class="dot r2 c1"></div>
        <div v-if="value === 6" class="dot r2 c3"></div>
    </div>
</template>

<script setup>
defineProps({
    value: {
        type: Number,
        required: true,
        validator: (v) => v >= 1 && v <= 6,
    },
});
</script>

<style scoped>
.dice {
    aspect-ratio: 1;
    background: white;
    border-radius: 15%;
    position: relative;
    box-shadow: 0 0.1em 0 #ccc;
    flex-shrink: 0;
}

.dot {
    position: absolute;
    width: 15%;
    height: 15%;
    background: black;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

/* Row/Column Coordinates */
.r1 {
    top: 25%;
}
.r2 {
    top: 50%;
}
.r3 {
    top: 75%;
}
.c1 {
    left: 25%;
}
.c2 {
    left: 50%;
}
.c3 {
    left: 75%;
}
</style>

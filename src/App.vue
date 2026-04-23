<template>
<RouterView/>
</template>

<script setup>

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
    overflow: scroll;
}

#app {
    display: flex;
    margin: 0;
    min-height: 100dvh;
    justify-content: center;
    align-items: center;
    width: 100%;
}

@media (max-width: 768px) {
    #app {
        padding-bottom: 75%;
    }
}
</style>

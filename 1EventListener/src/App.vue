<script setup>
import { ref } from 'vue';
import Experiment from "@/components/Experiment.vue";

const experimentRef = ref(null);
const spin = () => {
    experimentRef.value.spin();
};
const blob = () => {
    experimentRef.value.blob();
}

const change = () => {
    experimentRef.value.change();
}

</script>

<template>
    <header style="display:flex;flex-direction: column;">
        <h2 style="width:100%;text-align: center;">Freestyle ThreeJS 1</h2>
        <div style="display:flex;flex-direction: row;justify-content: space-between;width:100%;">
            <button class="menuBtn" @click="spin">Spin</button>
            <button class="menuBtn" @click="blob">Blob</button>
            <button class="menuBtn" @click="change">Change</button>
        </div>
    </header>
    <main>
        <Experiment ref="experimentRef"></Experiment>
    </main>
</template>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Belanosima:wght@600&display=swap');
    body {
        margin:0;
        padding:0;
    }
    header{position:fixed;top:left;width:100%;color:#b92020;}
    main{width:100vw;height:100vh;overflow: hidden;}
    h2{
        font-family: 'Belanosima';
    }
    .menuBtn{
        font-family: 'Belanosima';
        background-color: #f0f0f02a;
        background-color: 10;
        flex-grow: 1;
        height:10vh;
        border: none;
    }
    .menuBtn:hover{
        background-color: #f8f5f5;
    }
    .menuBtn:active{
        background-color: #dfdfdf;
    }
</style>

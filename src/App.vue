<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view v-title="$route"/>
        </transition>
    </div>
</template>

<style lang="less">
    .size {
        width: 100%;
        height: 100%;
    }

    #app {
        .size
    }

    body, html {
        .size;
        overflow: hidden;
        margin: 0;
        padding: 0;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    }
</style>

<script>
    export default {
        name: 'app'
    }
</script>

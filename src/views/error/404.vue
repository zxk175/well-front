<template>
    <div class="_404">
        <h1 class="error-txt">{{txt}}</h1>
        <el-button @click="$router.go(-1)">返回上一页</el-button>
        <el-button type="primary" @click="$router.push({name: $config.homeName})">进入首页</el-button>
    </div>
</template>

<style scoped>
    ._404 {
        margin-top: 4%;
        text-align: center;
    }
</style>

<script>
    export default {
        data() {
            return {
                txt: "Oh~~您的页面好像飞走了~"
            }
        }
    }
</script>
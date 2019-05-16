<template>
    <el-menu unique-opened
             :default-active="menuActiveName || 'home'"
             :collapse-transition="false"
             :collapse="collapseFlag">
        <el-menu-item :index="$config.homeName" @click="$router.push({name: $config.homeName})">
            <icon-svg name="home" clazz="menu-icon"/>
            <span slot="title">首页</span>
        </el-menu-item>

        <side-menu-item v-for="menu in menuList" :key="menu.menuId" :menu="menu" :menus="menuList"/>
    </el-menu>
</template>

<script>
    import {getMenuList} from '../../../libs/util'
    import SideMenuItem from './side-menu-item.vue'

    export default {
        name: 'SideMenu',
        components: {SideMenuItem},
        props: {
            collapseFlag: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                menuList: [],
                menuActiveName: ''
            }
        },
        created() {
            this.menuList = getMenuList();
            this.routeHandle(this.$route);
        },
        watch: {
            $route: 'routeHandle'
        },
        methods: {
            routeHandle(route) {
                this.menuActiveName = route.meta.menuId;
            }
        }
    }
</script>

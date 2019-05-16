<template>
    <el-submenu v-if="menu.children && menu.children.length > 0" :index="menu.menuId">
        <template slot="title">
            <icon-svg :name="menu.icon" clazz="menu-icon"/>
            <span>{{menu.name}}</span>
        </template>

        <side-menu-item v-for="item in menu.children" :key="item.menuId" :menu="item" :menus="menus"/>
    </el-submenu>

    <el-menu-item v-else :index="menu.menuId" @click="gotoRouteHandle(menu)">
        <template slot="title">
            <icon-svg :name="menu.icon" clazz="menu-icon"/>
            <span>{{menu.name}}</span>
        </template>
    </el-menu-item>
</template>

<script>
    import {replaceUrl} from '../../../libs/util'

    export default {
        name: 'SideMenuItem',
        props: {
            menu: {
                type: Object,
                required: true
            },
            menus: {
                type: Array,
                required: true
            }
        },
        methods: {
            gotoRouteHandle(menu) {
                this.$router.push({name: replaceUrl(menu.url)});
            }
        }
    }
</script>

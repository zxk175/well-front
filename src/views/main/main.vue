<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapseFlag ? 'logo-collapse-width' : 'logo-width'">
                {{collapseFlag ? sysNameMin : sysNameMax}}
            </el-col>
            <el-col :span="4">
                <div class="tools" @click.prevent="setCollapse">
                    <icon-svg name="menu" fs="20"/>
                </div>
            </el-col>
            <el-col :span="6" class="user-info">
                <el-dropdown trigger="hover">
                    <div class="el-dropdown-link user-info-inner">
                        <img :src="user.avatar ? user.avatar : user.defAvatar" alt="userAvatar"/>
                        <span>{{user.userName}}</span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>

        <el-col :span="24" class="main">
            <el-aside :class="collapseFlag ? 'menu-collapsed' : 'menu-expanded'">
                <!-- 左侧导航菜单 -->
                <side-menu :collapseFlag="collapseFlag"/>
            </el-aside>

            <section class="content-container">
                <el-col :span="24" class="content-wrapper">
                    <el-card>
                        <!-- 内容显示区域 -->
                        <transition name="fade" mode="out-in">
                            <router-view/>
                        </transition>
                    </el-card>
                </el-col>
            </section>
        </el-col>
    </el-row>
</template>

<style lang="less" scoped>
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;

        .header {
            height: 60px;
            background: #0c9cfc;
            color: #fff;
            line-height: 60px;

            .user-info {
                float: right;
                margin-right: 20px;
                text-align: right;

                .user-info-inner {
                    color: #fff;
                    cursor: pointer;

                    img {
                        float: right;
                        margin: 10px 0 10px 10px;
                        width: 40px;
                        height: 40px;
                        border: 1px solid #fff;
                        border-radius: 6px;
                    }
                }
            }

            .logo {
                padding-right: 20px;
                padding-left: 20px;
                height: 60px;
                border-right: 1px solid rgba(238, 241, 146, 0.3);
                font-size: 22px;
            }

            .logo-width {
                width: 230px;
            }

            .logo-collapse-width {
                padding: 0;
                width: 65px;
                text-align: center;
            }

            .tools {
                padding: 0 18px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }

        .main {
            position: absolute;
            top: 60px;
            bottom: 0;
            display: flex;
            overflow: hidden;

            aside {
                width: 230px;
                flex: 0 0 230px;

                .el-menu {
                    height: 100%;
                }
            }

            .menu-collapsed {
                width: 65px;
                flex: 0 0 65px;
            }

            .menu-expanded {
                width: 230px;
                flex: 0 0 230px;
            }

            .content-container {
                overflow-y: scroll;
                margin-top: 10px;
                padding: 0 10px;
                flex: 1;
            }
        }
    }
</style>

<script>
    import '../../assets/icons/ali/iconfont.js'
    import {getUser, setToken} from '../../libs/util'
    import SideMenu from '../../components/main/side-menu'

    export default {
        components: {
            SideMenu
        },
        data() {
            return {
                user: {
                    userName: '请登录',
                    defAvatar: require('../../assets/images/avatar.png'),
                },
                sysNameMin: 'WS',
                sysNameMax: 'Well-System',
                collapseFlag: false,
            }
        },
        created() {
            this.user = Object.assign(this.user, getUser());
        },
        methods: {
            // 折叠导航栏
            setCollapse: function () {
                this.collapseFlag = !this.collapseFlag;
            },

            // 退出登录
            loginOut() {
                setToken('');

                this.$router.options.addFlag = false;
                this.$router.push({name: this.$config.loginName})
            }
        }
    };
</script>

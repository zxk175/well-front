<template>
    <div class="login">
        <div class="login-con">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRules" class="login-container">
                <h3 class="title">欢迎登录</h3>
                <el-form-item prop="mobile">
                    <el-input v-model="dataForm.mobile" placeholder="请输入手机号" clearable>
                        <template slot="prefix">
                            <icon-svg name="signal" fs="18"/>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="dataForm.password" type="password" placeholder="请输入密码" show-password clearable>
                        <template slot="prefix">
                            <icon-svg name="lock" fs="18"/>
                        </template>
                    </el-input>
                </el-form-item>
                <el-checkbox v-model="dataForm.checked" class="remember">记住密码</el-checkbox>
                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click.native.prevent="handleSubmit" :loading="loginIng">
                        {{loginIngTxt}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .login {
        width: 100%;
        height: 100%;
        background-image: url('../../assets/images/login-bg.jpg');
        background-size: cover;
        background-position: center;
        position: relative;

        &-con {
            position: absolute;
            right: 60px;
            top: 50%;
            transform: translateY(-60%);
            width: 300px;
        }
    }

    .login-container {
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        background-clip: padding-box;
        margin: 0 auto;
        width: 260px;
        padding: 25px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;

        .title {
            margin: 0 auto 40px auto;
            text-align: center;
            color: #505458;
        }

        .remember {
            margin: 0 0 35px 0;
        }
    }
</style>

<script>
    import {setUser, setToken} from '../../libs/util'
    import {login} from '../../api/user/user'
    import {error} from '../../libs/message'

    export default {
        data() {
            return {
                loginIng: false,
                loginIngTxt: "登录",
                dataForm: {
                    mobile: '18820216400',
                    password: '123456',
                    checked: true
                },
                dataRules: {
                    mobile: [
                        {required: true, message: '请输入手机', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                },
            }
        },
        methods: {
            handleSubmit() {
                const that = this;
                that.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        that.initStatus();

                        let params = {
                            mobile: that.dataForm.mobile,
                            password: that.dataForm.password
                        };

                        login(params, function (res) {
                            if (res.success) {
                                that.initStatus();
                                let data = res.data;
                                setUser(data.user);
                                setToken(data.token.token);

                                that.$store.dispatch('setPerms', data.perms).then(() => {
                                    that.$router.push({name: that.$config.homeName});
                                });
                            } else {
                                error(res.msg);
                                that.initStatus();
                            }
                        }, function () {
                            that.initStatus();
                        });
                    } else {
                        return false;
                    }
                })
            },

            initStatus() {
                this.loginIng = !this.loginIng;
                this.loginIngTxt = !this.loginIng ? "登录" : "登录中...";
            }
        }
    }
</script>
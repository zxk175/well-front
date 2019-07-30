<template>
    <el-dialog :title="opFlag ? '新增' : '修改'" :visible.sync="visible" :close-on-click-modal="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px">
            <el-form-item label="用户Id" prop="userId" v-show="!opFlag">
                <el-input v-model="dataForm.userId" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="dataForm.mobile" placeholder="手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :class="{'is-required': opFlag}">
                <el-input v-model="dataForm.password" type="password" placeholder="密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item label="管理员标识" prop="identity">
                <el-checkbox v-model="dataForm.identity" label="管理员标识" :true-label="2" :false-label="1" border></el-checkbox>
            </el-form-item>
            <el-form-item label="角色" size="mini" prop="roleList">
                <el-checkbox-group v-model="dataForm.roleList">
                    <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{role.roleName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="dataForm.state">
                    <el-radio :label="0">锁定</el-radio>
                    <el-radio :label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="text" size="mini" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {info, op} from '../../api/sys/sys-user'
    import {listRole} from '../../api/sys/sys-role'

    export default {
        data() {
            let that = this;
            let validatePassword = (rule, value, callback) => {
                if (that.opFlag && !/\S/.test(value)) {
                    callback(new Error('密码不能为空'))
                } else {
                    callback()
                }
            };

            return {
                opFlag: true,
                visible: false,
                dataForm: {
                    userId: 0,
                    userName: '',
                    mobile: '',
                    password: '',
                    identity: 1,
                    state: 1,
                    roleList: []
                },
                dataRule: {
                    userName: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ]
                },
                roleList: []
            }
        },
        methods: {
            init(userId) {
                let that = this;
                that.visible = true;
                that.dataForm.userId = userId || 0;
                that.opFlag = that.dataForm.userId === 0;
                that.$nextTick(() => {
                    that.$refs.dataForm.resetFields();
                });

                listRole({page: 0, size: 10}, function (res) {
                    if (res.success) {
                        that.roleList = res.data;

                        if (!that.opFlag) {
                            that.getInfo(userId);
                        }
                    } else {
                        that.roleList = [];
                    }
                })
            },

            getInfo(userId) {
                let that = this;

                info(userId, function (res) {
                    if (res.success) {
                        Object.assign(that.dataForm, res.data);
                    }
                });
            },

            dataFormSubmit() {
                let that = this;
                that.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        let params = that.dataForm;
                        if (that.opFlag) {
                            delete params["userId"];
                        }

                        op(that.opFlag, params, function (res) {
                            if (res.success) {
                                that.visible = false;
                                that.$emit('refreshData');
                            }
                        })
                    }
                });
            }
        }
    }
</script>

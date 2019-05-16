<template>
    <el-dialog :title="opFlag ? '新增' : '修改'" :visible.sync="visible" :close-on-click-modal="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px">
            <el-form-item label="角色Id" prop="userId" v-show="!opFlag">
                <el-input v-model="dataForm.roleId" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色标签" prop="roleSign">
                <el-input v-model="dataForm.roleSign" placeholder="角色标签" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="备注" clearable></el-input>
            </el-form-item>
            <el-form-item label="授权" size="mini">
                <el-tree node-key="menuId" ref="menuListTree"
                         :data="menuList"
                         :props="menuListTreeProps"
                         :default-expand-all="true"
                         :check-on-click-node="true"
                         show-checkbox>
                </el-tree>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="dataForm.state">
                    <el-radio :label="0">关闭</el-radio>
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
    import {infoRole, opRole} from '../../api/sys/sys-role'
    import {listMenu} from '../../api/sys/sys-menu'

    export default {
        data() {
            return {
                opFlag: true,
                visible: false,
                dataForm: {
                    roleId: 0,
                    roleName: '',
                    roleSign: '',
                    remark: '',
                    state: 1
                },
                dataRule: {
                    roleName: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'}
                    ]
                },
                menuList: [],
                menuListTreeProps: {
                    label: 'name',
                    children: 'children'
                },
                // 临时key, 用于解决tree半选中状态项回显时 所有子节点被选中问题.
                tempKey: "-888"
            }
        },
        methods: {
            init(roleId) {
                let that = this;
                that.visible = true;
                that.dataForm.roleId = roleId || 0;
                that.opFlag = that.dataForm.roleId === 0;
                that.$nextTick(() => {
                    that.$refs.dataForm.resetFields();
                    that.$refs.menuListTree.setCheckedKeys([]);
                });

                listMenu(function (res) {
                    if (res.success) {
                        that.menuList = res.data;

                        if (!that.opFlag) {
                            that.getInfo(roleId);
                        }
                    } else {
                        that.menuList = [];
                    }
                })
            },

            getInfo(roleId) {
                let that = this;

                infoRole(roleId, function (res) {
                    if (res.success) {
                        Object.assign(that.dataForm, res.data);
                        that.$nextTick(() => {
                            let index = res.data.menuList.indexOf(that.tempKey);
                            if (index >= 0) {
                                res.data.menuList.splice(index, res.data.menuList.length - index)
                            }

                            that.$refs.menuListTree.setCheckedKeys(res.data.menuList);
                        });
                    }
                });
            },

            dataFormSubmit() {
                let that = this;
                that.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        let params = that.dataForm;
                        if (that.opFlag) {
                            delete params["roleId"];
                        }

                        let menuListTree = that.$refs.menuListTree;
                        params['menuList'] = [].concat(menuListTree.getCheckedKeys(), [that.tempKey], menuListTree.getHalfCheckedKeys());

                        opRole(that.opFlag, params, function (res) {
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
